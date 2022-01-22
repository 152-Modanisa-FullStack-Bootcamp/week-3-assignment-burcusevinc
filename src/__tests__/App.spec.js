import {
    createLocalVue,
    mount
} from "@vue/test-utils"
import App from "@/App"
import Vuex from "vuex";
import {
    getters,
    state,
    mutations,
    actions
} from "@/store";

function mountComponent() {
    const localVue = createLocalVue() //App'in kopyasını alır.
    localVue.use(Vuex) //plugin

    return mount(App, { //App componentini alır.
        localVue,
        store: new Vuex.Store({
            state,
            getters,
            mutations,
            actions
        })
    });
}

function createLocalThis(counter) {
    return {
        $store: {
            state: {
                count: counter
            }
        }
    }
}

describe("App.vue", () => {
    describe("Exist tests", () => {
        it('sanity test', () => {
            return
        })
        it("should component exists", () => {
            const wrapper = mountComponent()
            expect(wrapper.exists()).toBeTruthy()
        })
        it("should h1 title exists", () => {
            const wrapper = mountComponent()
            const title = wrapper.find("#title")
            expect(title.exists()).toBeTruthy()
        })
        it("should h1 title text exist and match", () => {
            const wrapper = mountComponent()
            expect(wrapper.find("#title").text()).toEqual("Daily Corona Cases in Turkey")
        })

    })

    describe('check notificationArea', () => {
        it("should notificationArea class check", async () => {
            let wrapper = mountComponent() 
            state.count = 0

            const safeClass = wrapper.find(".notificationArea") //classı notificationArea olan elementi alır.
            expect(safeClass.classes()).toContain("safe") //state count'ın değerine göre, notificationArea classının içinden "safe" classını döndü.
            //console.log(safeClass)
            //console.log(safeClass.classes())

            state.count = 6 
            await wrapper.vm.$nextTick() //DOM'un güncellenmesi bekletilir.
            //DOM güncellenmezse, "safe" olarak kalabilir.

            //wrapper = mountComponent() //count 6 ile App componentini tekrar kaldırır.
            const NormalClass = wrapper.find(".notificationArea")
            expect(NormalClass.classes()).toContain("normal")

            state.count = 11
            await wrapper.vm.$nextTick()

            //wrapper = mountComponent() //count 6 ile App componentini tekrar kaldırır.
            const DangerClass = wrapper.find(".notificationArea")
            expect(DangerClass.classes()).toContain("danger")

        })

        it("should notificationArea text message check", () => {
            let count = 0 
            let localThis = createLocalThis(count) //createLocalThis fonksiyonu kullanıldı.
            let message = App.computed.message.call(localThis) //App.computed.message'ın içeriğini oluşturulan localThis ile çağırır.
            expect(message).toEqual(`So safe. Case count is ${count}k`) //message'ın içerğinin verilen string ile eşit olmasını kontrol ediyor.

            count = 6
            localThis = createLocalThis(count)
            message = App.computed.message.call(localThis)
            expect(message).toEqual(`Life is normal. Case count is ${count}k`)

            count = 11
            localThis = createLocalThis(count)
            message = App.computed.message.call(localThis)
            expect(message).toEqual(`Danger!!! Case count is ${count}k`)
        })

    })
})