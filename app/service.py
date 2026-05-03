try:
    from app.rules import rule_based_answer
    from app.ai_logic import ai_engine
except (ImportError, ModuleNotFoundError):
    from rules import rule_based_answer
    from ai_logic import ai_engine

def process_query(sanitized_question: str):
    """Orchestrate rule-based matching and AI fallback."""
    user_lower = sanitized_question.lower().strip()
    
    # 1. Try rule-based engine
    response = rule_based_answer(user_lower)
    if response:
        return response
    
    # 2. Fallback to AI engine
    return ai_engine.get_answer(sanitized_question)
