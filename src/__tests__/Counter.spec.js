import {
    createLocalVue,
    shallowMount
} from '@vue/test-utils'
import Counter from "@/Counter"
import Vuex from "vuex";
import Vue from 'vue';
import {
    dispatch,
    state
} from "@/store";


function mountComponent() { //kod tekrarını önlemek için fonksiyon oluşturuldu.
    //component, store kullandığı için options verilmeli.
    //createLocalVue import edilmeli.
    const localVue = createLocalVue() //localVue yaratılır.
    localVue.use(Vuex) //Vuex import edilmelii
    /* 
    1 - mount yerine shallowMount edilir, sebebi;
    Counter'ın içindeki childlara bakmamıza ihtiyaç yoktur.
    Bu casede sadece componentin render edilip edilmediğine bakıyoruz.
    shallowMount, mountdan daha hızlı çalışır.
    2 - Counter componenti import edilmeli.
    3 - shallowMount import edilmeli.
    */
    return shallowMount(Counter, {
        localVue,
        store: new Vuex.Store({
            state, //import edilmeliler
            dispatch
        })
    });
}

describe("Counter.vue", () => {
    describe("exists check", () => {
        //test ortamının oluşup oluşmadığını kontrol eder.
        it('sanity check for test environment', () => {
            return
        })
        //Counter.vue'nun component'i başarılı bir şekilde render edip etmediğini test eder.
        it("should component exists", () => {
            const wrapper = mountComponent() //wrapper oluşturulur.

            //expect ->
            //exists() metodu oluşturduğumuz wrapperı render ederken bir problem olup olmadığına bakar.(true-false döner.)
            //toBeTruthy ->
            expect(wrapper.exists()).toBeTruthy()
        })

        it("should render decrease button", () => {
            const wrapper = mountComponent()
            const decrease = wrapper.find('#decrease') //id selectorı decrease olan butonu bul.
            expect(decrease.exists()).toBeTruthy() //wrapperı render ederken problem olup olmadığına bak.
        })

        it("should render increase button", () => {
            const wrapper = mountComponent()
            const increase = wrapper.find('#increase') //id selectorı increase olan butonu bul.
            expect(increase.exists()).toBeTruthy() //wrapperı render ederken problem olup olmadığına bak.
        })

    })

    describe("check buttons functionality", () => {
        it("check decrease button functionality", async () => { //butona basınca sayınının azalıp azalmadığını kontrol eder.
            let dispatch = jest.fn()
            let state = jest.fn()

            const localThis = {
                $store: {
                    dispatch,
                    state
                }
            }
            Counter.computed.count.call(localThis)
            Counter.methods.decrease.call(localThis)
            expect(dispatch).toHaveBeenCalledWith('decrement')
        })

        it("check increase button functionality", () => { //butona basınca sayınının artıp artmadığını kontrol eder.
            let dispatch = jest.fn()
            let state = jest.fn()

            const localThis = {
                $store: {
                    dispatch,
                    state
                }
            }

            //const ret = Counter.computed.count.call(localThis)
            //console.log(ret) // 0 basar.
            Counter.methods.increase.call(localThis)
            expect(dispatch).toHaveBeenCalledWith('increment')
        })
    })

})