import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import config from './config'

Vue.use(Vuex)

const store = () => new Vuex.Store(config)

export default store
