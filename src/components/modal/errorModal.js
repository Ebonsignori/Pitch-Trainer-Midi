import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import { RedBtn } from '../Buttons'

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

const ErrorTitle = styled.h1`
  color: red;
`

// Modal.setAppElement('#root')
const OptionsWrapper = styled.div`
  display: flex;
  justify-content: center;
`

function ErrorModule ({
  modalOpen,
  closeModal,
  modalData,
}) {
  const onClose = () => modalData.onModalPrompt(true)
  return (
        <Modal
          isOpen={modalOpen}
          onRequestClose={onClose}
          style={customStyles}
          contentLabel="Prompt Modal"
          ariaHideApp={false}
        >
          <ErrorTitle>Error</ErrorTitle>
          <h2>{modalData.heading}</h2>
          <OptionsWrapper>
            <RedBtn onClick={onClose}>Ok</RedBtn>
          </OptionsWrapper>
        </Modal>
  )
}

export default ErrorModule
