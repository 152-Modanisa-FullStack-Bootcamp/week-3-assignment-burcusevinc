import { createLocalVue, mount } from "@vue/test-utils"
import App from "@/App"
import Vuex from "vuex";
import { getters, state, mutations, actions } from "@/store";

describe("App.vue", () => {
    describe("Exist tests", () => {
        //0.sanity check
        it('sanity test', () => {
            return
        })
        //0.sanity check
        it("should component exists", () => {
            const wrapper = mountComponent()
            expect(wrapper.exists()).toBeTruthy()
        })
        //1.h1 exist check
        it("should h1 title exists", () => {
            const wrapper = mountComponent()
            const title = wrapper.find("#title")
            expect(title.exists()).toBeTruthy()
        }) //2. h1 text check
        it("should h1 title text exist and match", () => {
            const wrapper = mountComponent()
            expect(wrapper.find("#title").text()).toEqual("Daily Corona Cases in Turkey")
        })
    })

    describe('check notificationArea', () => {
        //3.notificationArea class check based on getCount Value
        it("should notificationArea class work correctly", async () => {
            let wrapper = mountComponent()

            state.count = 0
            const safeClass = wrapper.find(".notificationArea")
            expect(safeClass.classes()).toContain("safe")

            state.count = 6
            //DOM'un güncellenmesi bekletilir.DOM güncellenmezse, "safe" olarak kalacaktı.
            await wrapper.vm.$nextTick() 
            const NormalClass = wrapper.find(".notificationArea")
            expect(NormalClass.classes()).toContain("normal")

            state.count = 11
            await wrapper.vm.$nextTick()
            const DangerClass = wrapper.find(".notificationArea")
            expect(DangerClass.classes()).toContain("danger")
        })

        //4.notificationArea text message check
        it("should text message show correctly", async () => {
            let wrapper = mountComponent()
            let countVar = 0
            let localThis =  {
                $store: {
                    state: {
                        count: countVar
                    }
                }
            }
            let message = App.computed.message.call(localThis)
            wrapper.vm.$store.state.count = countVar      
            await wrapper.vm.$nextTick()
            expect(wrapper.find(".notificationArea").text()).toEqual(`So safe. Case count is ${countVar}k`)

            countVar = 6
            wrapper.vm.$store.state.count = countVar      
            await wrapper.vm.$nextTick()
            expect(wrapper.find(".notificationArea").text()).toEqual(`Life is normal. Case count is ${countVar}k`)

            countVar = 11
            wrapper.vm.$store.state.count = countVar      
            await wrapper.vm.$nextTick()
            expect(wrapper.find(".notificationArea").text()).toEqual(`Danger!!! Case count is ${countVar}k`)
        })
    })
})

//mounts the component + create local vue and store.
function mountComponent() {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    return mount(App, {
        localVue,
        store: new Vuex.Store({
            state,
            getters,
            mutations,
            actions
        })
    });
}