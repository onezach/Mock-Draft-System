from flask import Flask, request, jsonify
from flask_cors import cross_origin

from draft import Draft

app = Flask(__name__)

NUM_ROUNDS = 4
teams = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6", "Team 7", "Team 8", "Team 9", "Team 10", "Team 11", "Team 12"]

x = Draft(NUM_ROUNDS, teams, 150)

@app.route("/", methods=['GET'])
@cross_origin()
def base():
    return jsonify(message="Server active")

@app.route("/client/pick", methods=['POST'])
@cross_origin()
def pick():
    data = request.get_json()
    x.make_pick(data["name"], data["team"], data["position"])
    return jsonify(message="Pick successful")

@app.route("/draft/update", methods=['GET'])
@cross_origin()
def status():
    return jsonify(current_team=x.get_current_team(), 
                   current_pick=x.current_pick,
                   num_rounds=NUM_ROUNDS, 
                   teams=teams, 
                   picks=x.picks, 
                   clock_running=x.clock_running, 
                   time_on_clock=x.time_on_clock)

@app.route("/draft/toggle_clock", methods=['GET'])
def toggle_clock():
    x.toggle_timer()
    return jsonify(clock_running=x.clock_running)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
