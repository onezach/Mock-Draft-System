from flask import Flask, request, jsonify
from flask_cors import cross_origin

from draft import Draft

app = Flask(__name__)

NUM_ROUNDS = 4
teams = ["Team 1", "Team 2", "Team 3", "Team 4"]#, "Team 5", "Team 6", "Team 7", "Team 8", "Team 9", "Team 10", "Team 11", "Team 12", ]

x = Draft(NUM_ROUNDS, teams)

@app.route("/", methods=['GET'])
@cross_origin()
def base():
    response = jsonify(message="Server active")
    return response

@app.route("/client/pick", methods=['POST'])
@cross_origin()
def pick():
    data = request.get_json()
    x.make_pick(data["name"], data["team"], data["position"])
    return jsonify(message="Pick successful")

@app.route("/client/update", methods=['GET'])
@cross_origin()
def send_status():
    return jsonify(pick=x.current_pick, team=x.get_current_team())


@app.route("/display/update", methods=['GET'])
@cross_origin()
def update_display():
    return jsonify(current_team=x.get_current_team(), num_rounds=NUM_ROUNDS, teams=teams, picks=x.picks)

    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)