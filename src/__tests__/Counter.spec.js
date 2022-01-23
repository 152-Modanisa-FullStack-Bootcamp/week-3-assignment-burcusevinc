import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Counter from "@/Counter"
import Vuex from "vuex";
import { actions, state, getters, mutations } from "@/store";

//mounts the component + create local vue and store.
function mountComponent() {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    return shallowMount(Counter, {
        localVue,
        store: new Vuex.Store({
            state, //import edilmeliler
            actions,
            getters,
            mutations
        })
    });
}

describe("Counter.vue", () => {
    //0. sanity check
    it('sanity check for test environment', () => {
        return
    })
    // Exists Check
    describe("exists check", () => {
        //1. component exist check
        it("should component exists", () => {
            const wrapper = mountComponent()
            expect(wrapper.exists()).toBeTruthy()
        })
        //2. decrease button check
        it("should render decrease button", () => {
            const wrapper = mountComponent()
            const decrease = wrapper.find('#decrease')
            expect(decrease.exists()).toBeTruthy()
            expect(decrease.text()).toEqual("Decrease")
        })
        //3. increase button check
        it("should render increase button", () => {
            const wrapper = mountComponent()
            const increase = wrapper.find('#increase')
            expect(increase.exists()).toBeTruthy()
            expect(increase.text()).toEqual("Increase")
        })
    })

    describe("buttons functionality checks", () => {
        //4. decrease button functionality check
        it("should decrease button work correctly", async () => {
            const wrapper = mountComponent()

            wrapper.find('#decrease').trigger('click')
            await wrapper.vm.$nextTick() //DOM'un update olması beklenir.

            let expectedCount = wrapper.vm.$store.state.count

            expect(wrapper.find('span').text()).toEqual(expectedCount + "k")
            console.log(wrapper.find('span').text())
        })

        //5. increase button functionality check
        it("should increase button work correctly", async () => {
            const wrapper = mountComponent()

            wrapper.find('#increase').trigger('click')
            await wrapper.vm.$nextTick() //DOM'un update olması beklenir.

            let expectedCount = wrapper.vm.$store.state.count

            expect(wrapper.find('span').text()).toEqual(expectedCount + "k")
        })

        //6. 2 increase + 1 decrease functionality check
        it("check increase and decrease functionality together", () => {
            const wrapper = mountComponent()

            wrapper.find('#increase').trigger('click')
            wrapper.find('#increase').trigger('click')
            wrapper.find('#decrease').trigger('click')

            let expectedCount = wrapper.vm.$store.state.count

            //expect(expectedCount).toEqual(1);
            expect(wrapper.find('span').text()).toEqual(expectedCount + "k")

        })

        //7. count text show check
        it("should count text show check", () => {
            const wrapper = mountComponent()
            expect(wrapper.find("span").text()).toEqual(`${state.count}k`)
        })
    })
})