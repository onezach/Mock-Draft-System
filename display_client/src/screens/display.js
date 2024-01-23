import { useState, useEffect, useCallback } from "react";

import { TEAM_MAPPINGS } from "../data/static";

const Display = (props) => {
  const [currentTeam, setCurrentTeam] = useState("");
  const [numRounds, setNumRounds] = useState(0);
  const [teams, setTeams] = useState([]);
  const [picks, setPicks] = useState([[]]);
  const [currentPick, setCurrentPick] = useState({
    round: 0,
    number: 0,
    overall: 0,
  });

  const [timeOnClock, setTimeOnClock] = useState(-1);
  // const [clockRunning, setClockRunning] = useState(false);

  const [timeout, setTimeout] = useState(0);
  const [refreshIntervalID, setRefreshIntervalID] = useState(0);

  const processError = (error) => {
    // no response from server
    if (error === -1) {
      console.log("not connected to server");
    }

    // invalid draft code
    else if (error === 100) {
      console.log("invalid draft code");
    }

    // unknown error
    else {
      console.log("unknown error");
    }
    setTimeout((t) => t + 1);
  };

  const refresh = useCallback(() => {
    fetch(props.serverURL + "/draft/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draft_code: props.draftCode }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error === 0) {
          setCurrentTeam(r.current_team);
          setNumRounds(r.num_rounds);
          setTeams(r.teams);
          setPicks(r.picks);
          // setClockRunning(r.clock_running);
          setTimeOnClock(r.time_on_clock);
          setCurrentPick(r.current_pick);

          setTimeout(0);
        } else {
          processError(r.error);
        }
      })
      .catch(() => {
        processError(-1);
      });
  }, [props.draftCode, props.serverURL]);

  // Refreshes data from server
  useEffect(() => {
    const refreshInterval = setInterval(refresh, 500);
    setRefreshIntervalID(refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [timeOnClock, refresh]);

  // Timeout -- if too many errors in a row (likely an invalid code), shuts down current refresh cycle
  //            and returns client to initialiation screen
  useEffect(() => {
    if (timeout > 4) {
      clearInterval(refreshIntervalID);
      props.onReset();
    }
  }, [timeout, props, refreshIntervalID]);

  const buildRounds = useCallback(() => {
    let rounds = [];
    for (let i = 0; i < numRounds; i++) {
      rounds.push(
        <div
          className="Round"
          style={{ fontSize: Math.min(350 / numRounds, 25) + "px" }}
          key={"r" + (i + 1)}
        >
          Round {i + 1}
        </div>
      );
    }
    return rounds;
  }, [numRounds]);

  const buildTeams = useCallback(() => {
    return teams.map((team) => (
      <div className="Team" key={team}>
        {team}
      </div>
    ));
  }, [teams]);

  const formatName = (raw) => {
    const nameSplit = raw.split(" ");
    const firstName = nameSplit.shift();
    const lastName = nameSplit.join(" ");
    return firstName[0] + ". " + lastName;
  };

  const computePickClass = useCallback(
    (round, team) => {
      const roundHighlighted = currentPick.round === round;

      if (currentPick.round % 2 === 1) {
        const activeTeam = team;

        if (roundHighlighted) {
          return currentPick.number === activeTeam
            ? "Pick-active"
            : "Pick-highlighted";
        } else if (currentPick.number === activeTeam) {
          return "Pick-highlighted";
        } else {
          return "Pick";
        }
      } else {
        const activeTeam = teams.length - team + 1;

        if (roundHighlighted) {
          return currentPick.number === activeTeam
            ? "Pick-active"
            : "Pick-highlighted";
        } else if (currentPick.number === activeTeam) {
          return "Pick-highlighted";
        } else {
          return "Pick";
        }
      }
    },
    [currentPick, teams.length]
  );

  const buildPicks = useCallback(() => {
    return picks.map((round, ridx) => (
      <div className="Pick-row" key={"r" + ridx}>
        {round.map((pick, pidx) => (
          <div
            className={computePickClass(ridx + 1, pidx + 1)}
            key={"r" + ridx + "p" + pidx}
          >
            {pick["show"] && (
              <div>
                <b>
                  {pick["position"]}
                  {pick["position_rank"]}
                </b>{" "}
                {pick["position"] !== "DST" ? formatName(pick["name"]) : ""} -{" "}
                {TEAM_MAPPINGS[pick["team"]]}
              </div>
            )}
          </div>
        ))}
      </div>
    ));
  }, [picks, computePickClass]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    let formattedSeconds = s.toString();
    if (formattedSeconds.length < 2) {
      formattedSeconds = "0" + formattedSeconds;
    }
    return m + ":" + formattedSeconds;
  };

  return (
    <div className="Container">
      <div className="Header">
        <div className="OffTitle">{props.draftCode}</div>
        <div className="OnTitle">
          {currentTeam} - {formatTime(timeOnClock)}
        </div>
        <div className="OffTitle"></div>
      </div>
      <div className="BoardContainer">
        <div className="Board">
          <div
            className="RoundColContainer"
            style={{ width: Math.min(150 / numRounds, 8) + "%" }}
          >
            <div className="Round-empty" />
            {buildRounds()}
          </div>
          <div className="TeamColContainer">
            <div className="Team-row">{buildTeams()}</div>
            <div className="PicksGrid">{buildPicks()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;
