import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import codeGen from '../../modules/codeGen'
import {
  ADD_COMPONENT,
  SET_SELECTED_COMPONENT_ID,
  SHOULD_COMPONENTS_UPDATE,
  UPDATE_COMPONENT,
} from '../../redux/types/components_types'
import { Backdrop, InitialIcon, InitialText, Main } from './editor_styles'
import shortid from 'shortid'
import MyButton from '../customButtons/CustomButtons'

/**
 * Editor component
 */
const Editor = () => {
  /**
   * Redux
   */
  const dispatch = useDispatch()
  const Components = useSelector(({ components }) => components)
  const ShouldCompsUpdate = useSelector(
    ({ shouldComponentsUpdate }) => shouldComponentsUpdate
  )
  const SelectedCompID = useSelector(({ selectedCompID }) => selectedCompID)

  /**
   * State
   */
  const [Initialized, setInitialized] = useState(0)

  /**
   * Initial component
   */
  const initialize = () => {
    // Generate new component and related code
    const generatedComp = codeGen({
      id: shortid.generate(),
      name: 'First Component',
      type: 'div',
      props: [
        {
          key: 'isHome',
          value: 'true',
          type: 'exp',
        },
        {
          key: 'testProp',
          value: 'test',
          type: 'str',
        },
      ],
      styles:
        'margin: 0;\npadding: 1em;\nheight: 10em;\nborder: 1px solid #a1a1a1;',
      children: [<p children='some text' />, <button children='test' />],
    })

    dispatch({
      type: ADD_COMPONENT,
      payload: generatedComp,
    })

    const comp2 = codeGen({
      id: shortid.generate(),
      name: 'First Component',
      type: 'div',
      props: [
        {
          key: 'isHome',
          value: 'true',
          type: 'exp',
        },
        {
          key: 'testProp',
          value: 'test',
          type: 'str',
        },
      ],
      styles:
        'margin: 0;\npadding: 1em;\nheight: 10em;\nborder: 1px solid #a1a1a1;',
    })

    dispatch({
      type: ADD_COMPONENT,
      payload: comp2,
    })

    setInitialized(true)
  }

  /**
   * Watch for update flag from redux
   */
  useEffect(() => {
    if (ShouldCompsUpdate) {
      // Find selected component in redux
      const { id, name, type, props, styles } = Components.find(
        ({ id }) => id == SelectedCompID
      )

      // generate a new component and related codes with selected comp data
      const updatedComp = codeGen({ id, name, type, props, styles })

      // update redux to re-render react
      dispatch({ type: UPDATE_COMPONENT, payload: { id, updatedComp } })
      dispatch({ type: SHOULD_COMPONENTS_UPDATE, payload: false })
    }
  }, [ShouldCompsUpdate])

  /**
   * Render Elements
   */
  const RenderComponents = () =>
    Components.map(({ id, children, component: CustomComp }) => (
      <CustomComp
        key={id}
        isSelected={id == SelectedCompID}
        children={children}
        onClick={() => {
          dispatch({
            type: SET_SELECTED_COMPONENT_ID,
            payload: id,
          })
        }}
      />
    ))

  /**
   * Render
   */
  return Initialized ? (
    <Main>
      <Backdrop
        // Deselet all
        onClick={() =>
          dispatch({
            type: SET_SELECTED_COMPONENT_ID,
            payload: null,
          })
        }
      />
      <RenderComponents />
    </Main>
  ) : (
    <Main>
      <InitialIcon onClick={initialize}>
        <InitialText>Click Here To Initialize The Page</InitialText>
      </InitialIcon>
    </Main>
  )
}

export default Editor
