import { defineStore } from 'pinia';

export const useBetslipStore = defineStore('betslip', {
  state: () => ({
    betAmount: 0,
    betslip: [],
    betType: 'single', // 'single' or 'multiple'
  }),
  actions: {
    addBet(bet) {
      const existingBet = this.betslip.find(
        (item) => item.match.id === bet.match.id
      );
  
      if (existingBet) {
        // Update existing bet if necessary
        existingBet.teamBetOn = bet.teamBetOn
      } else {
        // Add new bet
        this.betslip.push(bet);
      }
  
      // Determine if betslip should be single or multiple
      this.betType = this.betslip.length > 1 ? 'multiple' : 'single';
    },
    removeBet(matchID, teamBetOn) {
      this.betslip = this.betslip.filter(
        (bet) => bet.match.id !== matchID || bet.teamBetOn !== teamBetOn
      );
  
      // Determine if betslip should be single or multiple
      this.betType = this.betslip.length > 1 ? 'multiple' : 'single';
    },
    setBetAmount(amount) {
      this.betAmount = amount;
    },
    clearBetslip() {
      this.betslip = [];
      this.setBetAmount(0)
      this.betType = 'single';
    },

  },
  getters: {
    totalOdds: (state) => {
      let odds = 1;
      return state.betslip.reduce((total, item) => {
        
        if (item.teamBetOn === 'draw') {
          odds = parseFloat(item.match.drawOdds);
        } else if (item.teamBetOn === 'teamA') {
          odds = parseFloat(item.match.teamA.odds);
        } else if (item.teamBetOn === 'teamB') {
          odds = parseFloat(item.match.teamB.odds);
        }

        return total * odds;
      }, 1).toFixed(2);
    },
    potentialPayout(state) {
      return state.betAmount * this.totalOdds
    },
    getBetSlip: (state) => {
      return state.betslip;
    },
    getBetType: (state) => {
      return state.betType;
    },
    getBetAmount: (state) => {
      return state.betAmount;
    },
    getBetCount: (state) => {
      return state.betslip.length;
    }
  },
});
