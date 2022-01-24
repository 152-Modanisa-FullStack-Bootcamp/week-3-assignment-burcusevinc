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
            const title = wrapper.find("h1") //h1 element find
            expect(title.exists()).toBeTruthy() //exist
        }) 
        //2. h1 text matching text
        it("should h1 title text match", () => {
            const wrapper = mountComponent()
            //h1 element's text should equal to "Daily Corona Cases in Turkey"
            expect(wrapper.find("h1").text()).toEqual("Daily Corona Cases in Turkey")
        })
    })

    describe('check notificationArea', () => {
        let wrapper
        let countVar = 0 
        beforeEach(() => {
            wrapper = mountComponent()
        })
        //3.notificationArea classes checks based on getCount Value
        //find safe class
        it("should notificationArea class include safe class", async () => {
            countVar = 0
            wrapper.vm.$store.state.count = countVar
            const safeClass = wrapper.find(".notificationArea") //find the class
            expect(safeClass.classes()).toContain("safe")  // if countVar is 0, class should be "safe"
        })
        //find normal class
        it("should notificationArea class include normal class", async () => {
            countVar = 5
            wrapper.vm.$store.state.count = countVar
            //Waits for the DOM to update. If the DOM doesn't update, the class will be "safe"
            await wrapper.vm.$nextTick() 
            const NormalClass = wrapper.find(".notificationArea")
            expect(NormalClass.classes()).toContain("normal") // if countVar is 5, class should be "normal"
        })
        //find danger class
        it("should notificationArea class include danger class", async () => {
            countVar = 10
            wrapper.vm.$store.state.count = countVar
            await wrapper.vm.$nextTick()
            const DangerClass = wrapper.find(".notificationArea")
            expect(DangerClass.classes()).toContain("danger")//if countVar is 10, class should be "danger"
        })

        //4. text messages check of notificationArea classes 
        //safe class message
        it("should safe class message show correctly", async () => {
            countVar = 0
            wrapper.vm.$store.state.count = countVar      
            await wrapper.vm.$nextTick()

            //if countVar is 0, class text should be equal to the string below.
            expect(wrapper.find(".notificationArea").text()).toEqual(`So safe. Case count is ${countVar}k`)
        })
        //normal class message
        it("should normal class message show correctly", async () => {
            countVar = 5
            wrapper.vm.$store.state.count = countVar      
            await wrapper.vm.$nextTick()

            //if countVar is 5, class text should be equal to the string below.
            expect(wrapper.find(".notificationArea").text()).toEqual(`Life is normal. Case count is ${countVar}k`)
        })
        //danger class message
        it("should danger class message show correctly", async () => {
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