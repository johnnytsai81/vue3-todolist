import { defineStore } from 'pinia'

export const useUtilityStore = defineStore('utility', {
  state: (): any => {
    return {
      // 選單是否收合
      isMenuShow: false,
    };
  },
  getters: {
  },
  actions: {
    // 設定手機選單是否打開
    setMenuShow(val: boolean) {
      this.isMenuShow = val
    },
  },
});
