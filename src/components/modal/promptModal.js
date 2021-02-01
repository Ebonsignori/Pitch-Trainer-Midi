import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import { GreenBtn, RedBtn } from '../Buttons'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

// Modal.setAppElement('#root')
const OptionsWrapper = styled.div`
  display: flex;
  justify-content: center;
`

function PromptModal ({
  modalOpen,
  closeModal,
  modalData,
}) {
  return (
        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Prompt Modal"
          ariaHideApp={false}
        >
          <h2>{modalData.heading}</h2>
          <OptionsWrapper>
            <GreenBtn onClick={() => modalData.onModalPrompt(true)}>Yes</GreenBtn>
            <RedBtn onClick={() => modalData.onModalPrompt(false)}>No</RedBtn>
          </OptionsWrapper>
        </Modal>
  )
}

export default PromptModal
