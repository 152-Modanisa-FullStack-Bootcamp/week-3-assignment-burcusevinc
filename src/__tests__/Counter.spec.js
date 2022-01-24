import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Counter from "@/Counter"
import Vuex from "vuex";
import { actions, state, getters, mutations } from "@/store";

//mounts the component + created the local vue and store.
function mountComponent() {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    return shallowMount(Counter, {
        localVue,
        store: new Vuex.Store({
            //we must use stringify and parse methods because we don't want to manipulate the real state object.
            state : JSON.parse(JSON.stringify(state)),  
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
        //1. counter component exist check
        it("should component exists", () => {
            const wrapper = mountComponent()
            expect(wrapper.exists()).toBeTruthy() 
        })
        //2. decrease button exist and text check
        it("should render decrease button", () => {
            const wrapper = mountComponent()
            const decrease = wrapper.find('#decrease') //find the decrease button
            expect(decrease.exists()).toBeTruthy() //exist
            expect(decrease.text()).toEqual("Decrease") // button element's should be equal to "Decrease"
        })
        //3. increase button exist and text check
        it("should render increase button", () => {
            const wrapper = mountComponent()
            const increase = wrapper.find('#increase') //find the increase button
            expect(increase.exists()).toBeTruthy() //exist
            expect(increase.text()).toEqual("Increase") // button element's should be equal to "Increase"
        })
    })

    describe("buttons functionality checks", () => {
        //4. decrease button functionality check
        it("should decrease button work correctly", async () => {
            //It is the another solution:
            /*const wrapper = mountComponent()
            wrapper.find('#decrease').trigger('click')
            await wrapper.vm.$nextTick() //DOM'un update olması beklenir.
            let expectedCount = wrapper.vm.$store.state.count 
            expect(wrapper.find('span').text()).toEqual(expectedCount + "k")
            console.log(wrapper.find('span').text())*/

            const dispatchMock = jest.fn() //mock function
            const wrapper = mount(Counter, {
                mocks: {
                    $store: {
                        state,
                        dispatch: dispatchMock
                    }
                }
            })
            wrapper.find('#decrease').trigger('click') //trigger decrease button
            expect(dispatchMock).toHaveBeenCalledWith('decrement') //Called the decrement function on the Actions object
        })

        //5. increase button functionality check
        it("should increase button work correctly", async () => {
            //It is the another solution:
            /*const wrapper = mountComponent()
            wrapper.find('#increase').trigger('click')
            await wrapper.vm.$nextTick() //Waits for the DOM to update.
            let expectedCount = wrapper.vm.$store.state.count
            expect(wrapper.find('span').text()).toEqual(expectedCount + "k")*/

            const dispatchMock = jest.fn() //mock function
            const wrapper = mount(Counter, {
                mocks: {
                    $store: {
                        state,
                        dispatch: dispatchMock
                    }
                }
            })
            wrapper.find('#increase').trigger('click') //trigger the button
            expect(dispatchMock).toHaveBeenCalledWith('increment') //Called the increment function on the Actions object
        })

        //6. 2 increase + 1 decrease functionality check
        it("check increase and decrease functionality together", async() => {
            const wrapper = mountComponent()

            wrapper.find('#increase').trigger('click') //1.increase
            wrapper.find('#increase').trigger('click') //2.increase
            wrapper.find('#decrease').trigger('click') //1.decrease
            await wrapper.vm.$nextTick() //Waits for the DOM to update.

            let expectedCount = wrapper.vm.$store.state.count //take the count value on the real store.

            //expect(expectedCount).toEqual(1);
            expect(wrapper.find('span').text()).toEqual(expectedCount + "k") //span element's text should be equal to "countk"

        })

        //7. count text show check
        it("should count text show check", () => {
            const wrapper = mountComponent()
            expect(wrapper.find("span").text()).toEqual(`${state.count}k`)
        })
    })
})