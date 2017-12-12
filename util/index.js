const fs = require('fs')
const path = require('path')

const FILE_PATH = path.join(__dirname, '../data/store.txt')

// accounts = [{balance:100, ref:123}, {balance:150, ref:124}]
// ref = 123
// returns [{balance:100, ref:123}]
const filterByRef = (accounts, ref) => {
	return accounts.filter((account) => {
		return account.ref === ref
	})
}

const indexOf = (accounts, ref) => {
	for (var i = 0; i < accounts.length; i++) {
		if (accounts[i].ref === ref) return i
	}

	// element with ref 'ref' is absent
	return -1
}

const readFile = function() {
	return new Promise((fulfill, reject) => {
		fs.readFile(FILE_PATH, 'utf-8', (err, data) => {
			if (err) reject(err)
			try {
				const store = JSON.parse(data)
				fulfill(store)
			} catch (err) {
				reject(err)
			}
		})
	})
}

const writeFile = function(fileContent) {
	return new Promise((fulfill, reject) => {
		fs.writeFile(FILE_PATH, fileContent, (err) => {
			if (err) reject(err)
			else fulfill()
		})
	})
}

module.exports = {
	getAccounts: function() {
			return readFile()
	},

	getAccountByRef: function(ref) {
		return readFile().then((store) => {
			return filterByRef(store.accounts, ref)
		})
	},

	createAccount: function(account) {
		return readFile().then((store) => {
			const isDuplicate = filterByRef(store.accounts, account.ref).length
			if (isDuplicate) {
				return -1
			} else {
				store.accounts.push(account)
				return writeFile(JSON.stringify(store, null, 2))
					.then(() => {
						return account
					})
			}

		})
	},

	updateAccount: function(account) {
		return readFile().then((store) => {
			const index = indexOf(store.accounts, account.ref)
			if (index > -1) {
				store.accounts[index].balance = account.balance
				return writeFile(JSON.stringify(store))
					.then(() => {
						return account
					})
			}
			return -1
		})
	},

	deleteAccount: function(ref) {
		return readFile().then((store) => {
			const index = indexOf(store.accounts, ref)
			if (index > -1) {
				store.accounts.splice(index, 1)
				return writeFile(JSON.stringify(store))
					.then(() => {
						return 1
					})
			} else {
				return -1
			}
		})
	}
}
