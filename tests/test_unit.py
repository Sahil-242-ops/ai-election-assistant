from app.rules import rule_based_answer
from app.data import QUIZ_QUESTIONS

def test_rule_based_democracy():
    ans = rule_based_answer("what is democracy")
    assert "system of government" in ans.lower()

def test_rule_based_election():
    ans = rule_based_answer("what is an election")
    assert "formal and organized process" in ans.lower()

def test_rule_based_importance():
    ans = rule_based_answer("importance of voting")
    assert "fundamental right" in ans.lower()

def test_rule_based_eci():
    ans = rule_based_answer("what is eci")
    assert "election commission of india" in ans.lower()

def test_rule_based_cec():
    ans = rule_based_answer("who is cec")
    assert "chief election commissioner" in ans.lower()

def test_rule_based_ro():
    ans = rule_based_answer("returning officer")
    assert "returning officer" in ans.lower()

def test_rule_based_eligibility():
    ans = rule_based_answer("eligibility to vote")
    assert "18 years of age" in ans.lower()

def test_rule_based_age():
    ans = rule_based_answer("voter age")
    assert "18" in ans

def test_rule_based_register():
    ans = rule_based_answer("how to register")
    assert "form 6" in ans.lower()

def test_rule_based_voterid():
    ans = rule_based_answer("epic")
    assert "voter id" in ans.lower()

def test_rule_based_documents():
    ans = rule_based_answer("documents needed")
    assert "aadhaar" in ans.lower()

def test_rule_based_electoral_roll():
    ans = rule_based_answer("electoral roll search")
    assert "electoral roll" in ans.lower()

def test_rule_based_how_to_vote():
    ans = rule_based_answer("how to vote")
    assert "press your candidate's button" in ans.lower()

def test_rule_based_booth():
    ans = rule_based_answer("polling booth finder")
    assert "polling booth" in ans.lower()

def test_rule_based_timing():
    ans = rule_based_answer("voting timings")
    assert "7:00 am" in ans.lower()

def test_rule_based_evm():
    ans = rule_based_answer("evm")
    assert "electronic voting machine" in ans.lower()

def test_rule_based_vvpat():
    ans = rule_based_answer("vvpat")
    assert "paper audit trail" in ans.lower()

def test_rule_based_nota():
    ans = rule_based_answer("nota")
    assert "none of the above" in ans.lower()

def test_rule_based_secure():
    ans = rule_based_answer("is it secure")
    assert "internet-free" in ans.lower()

def test_rule_based_timeline():
    ans = rule_based_answer("stages of election")
    assert "notification" in ans.lower()

def test_rule_based_nomination():
    ans = rule_based_answer("nomination papers")
    assert "candidates officially declare" in ans.lower()

def test_rule_based_campaign():
    ans = rule_based_answer("campaign silence")
    assert "silence period" in ans.lower()

def test_rule_based_mcc():
    ans = rule_based_answer("mcc rules")
    assert "model code of conduct" in ans.lower()

def test_rule_based_types():
    ans = rule_based_answer("types of elections")
    assert "lok sabha" in ans.lower()

def test_rule_based_general_election():
    ans = rule_based_answer("lok sabha election")
    assert "every 5 years" in ans.lower()

def test_rule_based_none():
    ans = rule_based_answer("what is the price of gold")
    assert ans is None

def test_quiz_data_integrity():
    assert len(QUIZ_QUESTIONS) == 5
    for q in QUIZ_QUESTIONS:
        assert "question" in q
        assert "options" in q
        assert "answer" in q
        assert q["answer"] in q["options"]
