import React, { useCallback, useState } from 'react'
import ReactModal from 'react-modal'

import { Container } from './styles'

interface ModalProps {
	closeModal(): void
	openModal(): void
	open: boolean
	title: string
}

const Modal: React.FC<ModalProps> = ({ closeModal, open, title, children }) => {
	return (
		<ReactModal
			isOpen={open}
			contentLabel="onRequestClose Example"
			onRequestClose={closeModal}
			style={{
				overlay: {
					background: 'rgba(31, 20, 73, 0.33)',
				},
				content: {
					width: '480px',
					height: '200px',
					position: 'fixed',
					top: 'calc(50vh - 100px)',
					left: 'calc(50vw - 240px)',
					borderRadius: '12px',
					background: '#1F1449',
					boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.25)',
					border: 'none',
				},
			}}
		>
			<Container>
				<h2>{title}</h2>
				{children}
			</Container>
		</ReactModal>
	)
}

export default Modal
