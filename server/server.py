from flask import Flask, request, jsonify
from flask_cors import cross_origin

app = Flask(__name__)

NUM_TEAMS = 12
NUM_ROUNDS = 4

current_pick = {"round": 1, "number": 1, "overall": 1}
picks = []
teams = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6", "Team 7", "Team 8", "Team 9", "Team 10", "Team 11", "Team 12", ]

position_counts = {"QB": 1, "RB": 1, "WR": 1, "TE": 1, "K": 1, "DST": 1}

@app.route("/", methods=['GET'])
@cross_origin()
def base():
    response = jsonify(message="Server active")
    return response

@app.route("/client/pick", methods=['POST'])
@cross_origin()
def new_pick():
    data = request.get_json()
    print(data)

    picks.append({
        "name": data["name"],
        "team": data["team"],
        "position": data["position"],
        "pick": current_pick,
        "position_rank": position_counts[data["position"]]
    })

    if current_pick["number"] == NUM_TEAMS:
        current_pick["round"] = current_pick["round"] + 1
        current_pick["number"] = 1
    else:
        current_pick["number"] = current_pick["number"] + 1
    current_pick["overall"] = current_pick["overall"] + 1


    position_counts[data["position"]] = position_counts[data["position"]] + 1


    return jsonify(message="Pick successful", pick=picks)

@app.route("/client/update", methods=['GET'])
@cross_origin()
def send_status():
    return jsonify(pick=current_pick, team=picking_team())


@app.route("/display/update", methods=['GET'])
@cross_origin()
def update_display():
    return jsonify(current_team=picking_team(), num_rounds=NUM_ROUNDS, teams=teams)

def picking_team():
    if current_pick["round"] % 2 == 1:
        return teams[current_pick["number"] - 1]
    else:
        return teams[NUM_TEAMS - current_pick["number"]]
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True) 