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
        //0.app component check
        it("should component exists", () => {
            const wrapper = mountComponent()
            expect(wrapper.exists()).toBeTruthy()
        })
        //1.h1 exist check
        it("should h1 title exists", () => {
            const wrapper = mountComponent()
            const title = wrapper.find("#title") //h1 element find
            expect(title.exists()).toBeTruthy() //exist
        }) 
        //2. h1 text matching text
        it("should h1 title text match", () => {
            const wrapper = mountComponent()
            //h1 element's text should equal to "Daily Corona Cases in Turkey"
            expect(wrapper.find("#title").text()).toEqual("Daily Corona Cases in Turkey")
        })
    })

    describe('check notificationArea', () => {
        //3.notificationArea classes checks based on getCount Value
        it("should notificationArea class work correctly", async () => {
            let countVar = 0
            let localThis =  {
                $store: {
                    state: {
                        count: countVar
                    }
                }
            }
            let wrapper = mountComponent()

            countVar = 0
            wrapper.vm.$store.state.count = countVar
            const safeClass = wrapper.find(".notificationArea") //find the class
            expect(safeClass.classes()).toContain("safe")  // if countVar is 0, class should be "safe"

            countVar = 5
            wrapper.vm.$store.state.count = countVar
            //Waits for the DOM to update. If the DOM doesn't update, the class will be "safe"
            await wrapper.vm.$nextTick() 
            const NormalClass = wrapper.find(".notificationArea")
            expect(NormalClass.classes()).toContain("normal") // if countVar is 5, class should be "normal"

            countVar = 10
            wrapper.vm.$store.state.count = countVar
            await wrapper.vm.$nextTick()
            const DangerClass = wrapper.find(".notificationArea")
            expect(DangerClass.classes()).toContain("danger")//if countVar is 10, class should be "danger"
        })

        //4. text messages check of notificationArea classes 
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

            //if countVar is 0, class text should be equal to the string below.
            expect(wrapper.find(".notificationArea").text()).toEqual(`So safe. Case count is ${countVar}k`)

            countVar = 5
            wrapper.vm.$store.state.count = countVar      
            await wrapper.vm.$nextTick()

            //if countVar is 5, class text should be equal to the string below.
            expect(wrapper.find(".notificationArea").text()).toEqual(`Life is normal. Case count is ${countVar}k`)

            countVar = 10
            wrapper.vm.$store.state.count = countVar      
            await wrapper.vm.$nextTick()

            //if countVar is 10, class text should be equal to the string below.
            expect(wrapper.find(".notificationArea").text()).toEqual(`Danger!!! Case count is ${countVar}k`)
        })
    })
})

//mounts the component + created the local vue and store.
function mountComponent() {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    return mount(App, {
        localVue,
        store: new Vuex.Store({
            //we must use stringify and parse methods because we don't want to manipulate the real state object.
            state : JSON.parse(JSON.stringify(state)), 
            getters,
            mutations,
            actions
        })
    });
}