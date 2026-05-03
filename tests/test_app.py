import json
import unittest.mock as mock

def test_home_page(client):
    """Test that the home page loads."""
    response = client.get("/")
    assert response.status_code == 200

def test_quiz_page(client):
    """Test that the quiz page loads."""
    response = client.get("/quiz")
    assert response.status_code == 200

def test_leaderboard_page(client):
    """Test that the leaderboard page loads."""
    response = client.get("/leaderboard")
    assert response.status_code == 200

def test_ask_endpoint_rule_match(client):
    """Test the /ask endpoint with a rule-based query."""
    response = client.post("/ask", 
                           data=json.dumps({"question": "what is evm"}),
                           content_type='application/json')
    assert response.status_code == 200
    data = response.get_json()
    assert "electronic voting machine" in data["answer"].lower()

def test_ask_endpoint_sanitization(client):
    """Test that HTML input is sanitized."""
    response = client.post("/ask", 
                           data=json.dumps({"question": "<b>test</b>"}),
                           content_type='application/json')
    assert response.status_code == 200

def test_ask_endpoint_length_limit(client):
    """Test the 200 character limit."""
    long_q = "a" * 201
    response = client.post("/ask", 
                           data=json.dumps({"question": long_q}),
                           content_type='application/json')
    assert response.status_code == 200
    data = response.get_json()
    # Updated message check
    assert "invalid input" in data["answer"].lower()

def test_api_questions(client):
    """Test the questions API."""
    response = client.get("/api/questions")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 5
    assert "answer" not in data[0]

def test_api_check_answer_correct(client):
    response = client.post("/api/answer",
                           data=json.dumps({"id": 1, "answer": "18"}),
                           content_type='application/json')
    assert response.status_code == 200
    assert response.get_json()["correct"] is True

def test_api_check_answer_wrong(client):
    response = client.post("/api/answer",
                           data=json.dumps({"id": 1, "answer": "21"}),
                           content_type='application/json')
    assert response.status_code == 200
    assert response.get_json()["correct"] is False

def test_leaderboard_flow(client):
    # Post a score
    client.post("/api/leaderboard",
                data=json.dumps({"name": "Test User", "score": 80}),
                content_type='application/json')
    
    # Get leaderboard
    response = client.get("/api/leaderboard")
    assert response.status_code == 200
    data = response.get_json()
    assert any(entry["name"] == "Test User" for entry in data)

def test_leaderboard_limit(client):
    for i in range(15):
        client.post("/api/leaderboard",
                    data=json.dumps({"name": f"User {i}", "score": i}),
                    content_type='application/json')
    
    response = client.get("/api/leaderboard")
    data = response.get_json()
    assert len(data) <= 10
    assert data[0]["score"] >= 14

@mock.patch("app.ai_logic.ai_engine.client")
def test_ask_ai_fallback(mock_genai_client, client):
    """Test fallback to AI when no rule matches."""
    mock_response = mock.Mock()
    mock_response.text = "This is a mocked AI response about solar panels."
    mock_genai_client.models.generate_content.return_value = mock_response

    response = client.post("/ask", 
                           data=json.dumps({"question": "how do solar panels work"}),
                           content_type='application/json')
    
    assert response.status_code == 200
    data = response.get_json()
    assert "mocked AI response" in data["answer"]

@mock.patch("app.ai_logic.ai_engine.client")
def test_ask_ai_error(mock_genai_client, client):
    """Test error handling when AI call fails."""
    mock_genai_client.models.generate_content.side_effect = Exception("API error")

    response = client.post("/ask", 
                           data=json.dumps({"question": "how do solar panels work"}),
                           content_type='application/json')
    
    assert response.status_code == 200
    data = response.get_json()
    assert "error connecting" in data["answer"].lower()

def test_ask_no_client(client):
    """Test behavior when no API key is provided."""
    with mock.patch("app.ai_logic.ai_engine.client", None):
        response = client.post("/ask", 
                               data=json.dumps({"question": "tell me something new"}),
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert "don't have a specific answer" in data["answer"].lower()

def test_empty_input(client):
    res = client.post("/ask", data=json.dumps({"question": ""}), content_type='application/json')
    assert res.status_code == 200
    assert "invalid input" in res.get_json()["answer"].lower()

def test_long_input(client):
    res = client.post("/ask", data=json.dumps({"question": "a"*300}), content_type='application/json')
    assert res.status_code == 200
    assert "invalid input" in res.get_json()["answer"].lower()

def test_invalid_method(client):
    res = client.get("/ask")
    assert res.status_code in [404, 405]

def test_unknown_query(client):
    res = client.post("/ask", data=json.dumps({"question": "random unknown text"}), content_type='application/json')
    assert res.status_code == 200
