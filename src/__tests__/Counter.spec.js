import {
    createLocalVue,
    shallowMount
} from '@vue/test-utils'
import Counter from "@/Counter"
import Vuex from "vuex";
import Vue from 'vue';
import {
    actions,
    state,
    getters,
    mutations
} from "@/store";


function mountComponent() { //kod tekrarını önlemek için fonksiyon oluşturuldu.
    //component, store kullandığı için options verilmeli.
    //createLocalVue import edilmeli.
    const localVue = createLocalVue() //localVue yaratılır.
    localVue.use(Vuex) //Vuex import edilmelii
    /* 
    1 - mount yerine shallowMount edilir, sebebi; Counter'ın içindeki childlara bakmamıza ihtiyaç yoktur.
    Bu casede sadece componentin render edilip edilmediğine bakıyoruz. shallowMount, mountdan daha hızlı çalışır.
    2 - Counter componenti import edilmeli.
    3 - shallowMount import edilmeli.
    */
    return shallowMount(Counter, {
        localVue,
        store: new Vuex.Store({
            state, //import edilmeliler
            actions: {
                decrement: actions.decrement,
                increment: actions.increment
            },
            getters,
            mutations
        })
    });
}

describe("Counter.vue", () => {
    //test ortamının oluşup oluşmadığını kontrol eder.
    it('sanity check for test environment', () => {
        return
    })
    describe("exists check", () => {

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
            expect(decrease.text()).toEqual("Decrease") //Butonun HTML text'ini kontrol eder.
        })

        it("should render increase button", () => {
            const wrapper = mountComponent()
            const increase = wrapper.find('#increase') //id selectorı increase olan butonu bul.
            expect(increase.exists()).toBeTruthy() //wrapperı render ederken problem olup olmadığına bak.
            expect(increase.text()).toEqual("Increase")
        })

    })

    describe("check buttons functionality", () => {
        //butona basınca sayınının azalıp azalmadığını kontrol eder.
        it("check decrease button functionality", async () => {
            const wrapper = mountComponent()

            wrapper.find('#decrease').trigger('click')
            await wrapper.vm.$nextTick() //DOM'un update olması beklenir.

            let expectedCount = wrapper.vm.$store.state.count
            expect(wrapper.find('span').text()).toEqual(expectedCount + "k")
            console.log(wrapper.find('span').text())

        })

         it("check increase button functionality", async() => { 
             //butona basınca sayınının artıp artmadığını kontrol eder.
            const wrapper = mountComponent()

            wrapper.find('#increase').trigger('click')
            await wrapper.vm.$nextTick() //DOM'un update olması beklenir.

            let expectedCount = wrapper.vm.$store.state.count
            expect(wrapper.find('span').text()).toEqual(expectedCount + "k")
            //console.log(wrapper.find('span').text())
         })

         it("check increase and decrease functionality together", async () => {
            const wrapper = mountComponent()

            wrapper.find('#increase').trigger('click')
            await wrapper.vm.$nextTick()

            wrapper.find('#decrease').trigger('click')
            await wrapper.vm.$nextTick()

            let expectedCount = wrapper.vm.$store.state.count
            expect(wrapper.find('span').text()).toEqual(expectedCount + "k")

        })

    })
    it("should count text show check", () => {
        const wrapper = mountComponent()
        //const text = wrapper.find('span').element.textContent //spanin içindeki texti çeker.
        //expect(text).toEqual(`${state.count}k`)
        expect(wrapper.find("span").text()).toEqual(`${state.count}k`)
    })

})