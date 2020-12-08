/* eslint-disable indent */
export default function typeToCashierMovimentName(type: number): string {
	switch (type) {
		case 0:
			return 'Abertura'
		case 1:
			return 'Débito'
		case 2:
			return 'Crédito'
		case 3:
			return 'Dinheiro'
		case 4:
			return 'Sangria'
		case 5:
			return 'Troco'
		case 6:
			return 'Fechamento'
		default:
			return 'error'
	}
}
