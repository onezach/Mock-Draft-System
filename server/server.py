from flask import Flask, request, jsonify
from flask_cors import cross_origin
import string
import random
import math

from draft import Draft
from exceptions import InvalidDraftCode, InvalidDraftPick

"""
Error Codes
0       No error
100     Invalid draft code
200     Invalid user code
300     Invalid draft pick (player already taken)
900     Unknown error
"""

app = Flask(__name__)

drafts = {str: Draft}

@app.route("/", methods=['GET'])
@cross_origin()
def base():
    return jsonify(message="Server active")

@app.route("/client/pick", methods=['POST'])
@cross_origin()
def pick():
    data = request.get_json()
    try:
        draft = validate(draft_code=data["draft_code"])
        draft.make_pick(data["name"], data["team"], data["position"])
        return jsonify(error=0)
    except InvalidDraftCode:
        return jsonify(error=100)
    except InvalidDraftPick:
        return jsonify(error=300)
    except Exception:
        return jsonify(error=900)

@app.route("/draft/update", methods=['POST'])
@cross_origin()
def status():
    data = request.get_json()
    try:
        draft = validate(draft_code=data["draft_code"])
        return jsonify(
            current_team=draft.get_current_team(), 
            current_pick=draft.current_pick,
            num_rounds=draft.num_rounds, 
            teams=draft.teams, 
            picks=draft.picks, 
            clock_running=draft.clock_running, 
            time_on_clock=draft.time_on_clock,
            error=0)
    except InvalidDraftCode:
        return jsonify(error=100)
    except Exception:
        return jsonify(error=900)
    
@app.route("/draft/toggle_clock", methods=['POST'])
def toggle_clock():
    data = request.get_json()

    try:
        draft = validate(draft_code=data["draft_code"])
        draft.toggle_timer()
        return jsonify(error=0)
    except InvalidDraftCode:
        return jsonify(error=100)
    except Exception:
        return jsonify(error=900)


@app.route("/draft/init", methods=['POST'])
def initialize_new_draft():

    data = request.get_json()
    draft_code = generate_code()

    rounds = data["numRounds"]
    teams = []
    for i in range(data["numTeams"]):
        teams.append(f"Team {i+1}")
    time_per_pick = data["timePerPick"]

    drafts[draft_code] = Draft(num_rounds=rounds, teams=teams, time_per_pick=time_per_pick)

    return jsonify(draft_code=draft_code)

@app.route("/draft/join", methods=['POST'])
@cross_origin()
def join_existing_draft():
    data = request.get_json()
    return jsonify(error=0) if data["draft_code"] in drafts else jsonify(error=100)

def generate_code() -> str:
    '''
    Generate a randomized code string consisting of 4 letters followed by 4 numbers
    '''
    letters = ""
    for i in range(4):
        letters = letters + (random.choice(string.ascii_letters))
    numbers = str(math.floor(random.random() * 10000))
    while len(numbers) < 4:
        numbers = "0" + numbers
    return letters + numbers

def validate(draft_code: str) -> Draft:
    '''
    Verify if a given draft code exists within the current set of active drafts

    Returns the requested Draft object if successful

    Raises an InvalidDraftCode exception if unsuccessful
    '''
    if draft_code not in drafts:
        raise InvalidDraftCode
    return drafts[draft_code]

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
