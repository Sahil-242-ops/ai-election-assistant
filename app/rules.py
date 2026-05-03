from functools import lru_cache

@lru_cache(maxsize=128)
def rule_based_answer(user: str):
    """Return a hardcoded answer for known questions, or None."""
    user = user.lower().strip()
    words = user.split()

    # Basic definitions & concepts
    if "democracy" in user:
        return "Democracy is a system of government where power is held by the citizens, who exercise it directly or through elected representatives."
    elif "what is an election" in user or ("election" in user and "what" in user):
        return "An election is a formal and organized process where citizens choose their representatives or leaders by casting votes."
    elif "why vote" in user or "importance of voting" in user:
        return "Voting is a fundamental right and civic duty. It gives you a voice in choosing leaders, shaping policies, and deciding the future direction of your community and country."

    # Election bodies
    elif "election commission" in user or "commission" in user or "eci" in words:
        return "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India at national, state, and district levels."
    elif "chief election commissioner" in user or "cec" in words:
        return "The Chief Election Commissioner heads the Election Commission. They ensure elections are conducted freely and fairly."
    elif "returning officer" in user or "ro" in words:
        return "A Returning Officer is responsible for overseeing the election in a specific constituency and declaring the results."

    # Eligibility & Registration
    elif "who can vote" in user or "eligibility" in user:
        return "Generally, any citizen who is 18 years of age or older on the qualifying date (usually Jan 1st) and is registered in the electoral roll can vote."
    elif "18" in words or "age" in words:
        return "You must be 18 years or older to register and vote."
    elif "register" in user or "enroll" in user or "new voter" in user:
        return "To register: Visit the Voter Portal (NVSP), fill out Form 6, upload proof of age and address, and submit. You can also use the Voter Helpline App."
    elif "voter id" in user or "epic" in words:
        return "The Voter ID (EPIC) is issued to registered voters. It serves as proof of identity and address during voting."
    elif "documents needed" in user or "proof" in user:
        return "To register, you need a passport-sized photo, proof of age (birth certificate, Aadhaar, PAN), and proof of address (passport, utility bill, Aadhaar)."
    elif "check name" in user or "electoral roll" in user or "voter list" in user:
        return "Check your name on the electoral roll via the Election Commission portal, entering your EPIC number, or searching by personal details."

    # Voting Process
    elif "vote" in user and "how" in user:
        return "Voting Process: 1. Ensure you're registered. 2. Go to your polling booth. 3. Show your ID. 4. Ink is applied to your finger. 5. Press your candidate's button on the EVM. 6. Verify with VVPAT slip."
    elif "where to vote" in user or "polling booth" in user:
        return "Find your polling booth on your voter slip, via the Voter Helpline app, or by searching your EPIC on the ECI website."
    elif "timing" in user or "time" in user:
        return "Polling usually takes place from 7:00 AM to 6:00 PM, though timings may vary by region."

    # Technology & Security
    elif "evm" in words or "evms" in words:
        return "EVM stands for Electronic Voting Machine. It consists of a Control Unit and Balloting Unit — making voting quicker, preventing invalid votes, and speeding up counting."
    elif "vvpat" in words or "vvpats" in words:
        return "VVPAT (Voter Verifiable Paper Audit Trail) is attached to EVMs so voters can verify their vote was cast correctly."
    elif "nota" in words:
        return "NOTA means 'None of the Above' — an option allowing a voter to officially reject all candidates."
    elif "secure" in user or "hack" in user:
        return "EVMs are standalone, internet-free machines. They undergo rigorous mock polls in the presence of political representatives before actual use."

    # Timeline
    elif "timeline" in user or "process" in user or "stages" in user:
        return "Election Stages: Notification → Filing Nominations → Scrutiny → Campaigning → Polling Day → Counting → Declaration of Results."
    elif "nomination" in user:
        return "Nomination is the process where candidates officially declare their intention to run by filing papers with the Returning Officer."
    elif "campaign" in user:
        return "During campaigning, candidates present their policies. Campaigning must stop 48 hours before polling ends (the 'silence period')."
    elif "code of conduct" in user or "mcc" in words:
        return "The Model Code of Conduct (MCC) is a set of guidelines from the ECI for parties and candidates to ensure fair elections. It activates as soon as elections are announced."

    # Types
    elif "types of elections" in user:
        return "In India: General Elections (Lok Sabha), State Assembly Elections (Vidhan Sabha), and Local Body Elections (Panchayats and Municipalities)."
    elif "general election" in user or "lok sabha" in user:
        return "General Elections are held every 5 years to elect Members of Parliament (MPs) to the Lok Sabha. The majority party forms the government."

    return None
