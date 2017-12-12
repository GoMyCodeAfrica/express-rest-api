const util = require('./util')

const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())

app.get('/accounts',  (req, res, next) => {
	util.getAccounts()
		.then((accounts) => {
			res.send(accounts)
		})
		.catch((err) => {
			next(err)
		})
})

app.get('/accounts/:ref', (req, res, next) => {
	const ref = Number(req.params.ref)
	util.getAccountByRef(ref).then((account) => {
		res.send(account)
	})
	.catch((err) => {
		next(err)
	})
})

app.post('/accounts', (req, res, next) => {
	const account = {
		ref: Number(req.body.ref),
	  balance: req.body.balance
	}
	util.createAccount(account)
		.then((createdAccount) => {
			if (createdAccount === -1) {
				// The request could not be completed due to a conflict
				// with the current state of the resource.
				res.status(409).send()
			} else {
				res.status(201).send(createdAccount)
			}
		})
		.catch((err) => {
			next(err)
		})
})

// update account
app.put('/accounts', (req, res, next) => {
  const account = {
		ref: Number(req.body.ref),
	  balance: req.body.balance
	}
	util.updateAccount(account)
		.then((account) => {
			if (account === -1) {
				res.status(404).send()
			} else {
				res.send('account updated')
			}
		})
		.catch((err) => {
			next(err)
		})
})

app.delete('/accounts/:ref', (req, res, next) => {
  const ref = Number(req.params.ref)
	util.deleteAccount(ref)
		.then((deleteIndex) => {
			if (deleteIndex === -1) {
				res.status(404).send('Not Found')
			} else {
				res.send('Account deleted')
			}
		})
		.catch((err) => {
			next(err)
		})
})

// Custom error middelware handler
app.use((err, req, res, next) => {
	res.status(500).send(err.message)
})

app.listen(3000, () => {
	console.log('server is up and running at port: 3000')
})
