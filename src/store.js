import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const state = {
  count: 0
}

export const getters = {
  getCount: state => state.count
}

//store'un değiştirilmesi:
//state'i değiştirebiliyor.
//payload -> kullanıcıdan alınan değer

export const mutations = { //commit, statei alır, payload -> obje, array olabilir, kullanıldığı yerde verilir.
  addToCount(state, nCount) { //state -> count
    state.count += nCount //metodu çağırınca yapılacak olan işlem
  },
}

//async call yapılabilir, await edilebilir.
//amaç: herhangibir mutations'ı çağırmak
//kullanıcı bir şey yapmış gibi 
//action tanımlayıp onun mutation çağırması sağlanır.
export const actions = { //dispatch
  //context içindeki commitleri destructuring ile alır.
  increment(context, payload) {
    context.commit('addToCount', 1)
  },
  decrement(context, payload) {
    context.commit('addToCount', -1) //fonksiyonu çağırır, payload = -1
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {} //birden fazla store tanımlamaya yarar.
})