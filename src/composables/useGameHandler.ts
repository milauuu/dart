import { ref, reactive,computed } from "vue";

// declaring Player interface
interface Player {
    name: string,
    score: number,  //score left to shoot
    dartsThisLeg: number,
    totalPointsScored: number,  //not displayed, needed for average
    legsWon: number,  //score-tracker for multiple legs
}

// declare the current state of the game -> source of truth
const state = reactive({
    phase: 'setup' as 'setup' | 'game' | 'winner',
    players: [] as Player[],
    currentPlayerIndex: 0,
    totalLegs: 1,
    currentLeg: 1,
    startingPlayerIndex: 0,
});

// Derived state , takes raw data and devies it into only readable values --> only gets the results
export function useGame() {
    const currentPlayer = computed(() => {
        return state.players[state.currentPlayerIndex]
    })

    const legsNeededToWin = computed(() => {
        return Math.ceil(state.totalLegs / 2)
    })

    const matchWinner = computed(() => {
        return state.players.find(p => p.legsWon >= legsNeededToWin.value)
    })
}

function startGame(names: string[], legs: number) {
  state.phase = 'game'
  state.totalLegs = legs
  state.currentLeg = 1
  state.currentPlayerIndex = 0
  state.startingPlayerIndex = 0

//generates the whole player interface for every Name of the Name-Array
  state.players = names.map(name => ({
    name,
    score: 501,
    dartsThrown: 0,
    totalPointsScored: 0,
    legsWon: 0,
    dartsThisLeg: 0,
  }))
}
