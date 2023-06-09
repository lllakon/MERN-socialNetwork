import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { UserModel } from '../models/index.js'

export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl:
				'https://icon-library.com/images/generic-user-icon/generic-user-icon-19.jpg',
			passwordHash: hash,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
		})
	} catch (error) {
		if (error.code === 11000) {
			console.log(error)
			res.status(409).json({
				message: 'Такой email уже зарегистрирован',
			})
		} else {
			console.log(error)
			res.status(500).json({
				message: 'Не удалось зарегестрироваться',
			})
		}
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)

		if (!user || !isValidPass) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		const { passwordHash, ...userData } = user._doc

		res.json(userData)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Нет досутпа',
		})
	}
}

export const updateUserAvatar = async (req, res) => {
	try {
		const userId = req.body.userId
		const newImageUrl = req.body.url

		await UserModel.updateOne(
			{
				_id: userId,
			},
			{
				avatarUrl: newImageUrl,
			}
		)

		res.json({
			sucess: true,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось изменить аватарку',
		})
	}
}

export const updateUserEmail = async (req, res) => {
	try {
		const userId = req.body.userId
		const newEmail = req.body.url
		await UserModel.updateOne(
			{
				_id: userId,
			},
			{
				email: newEmail,
			}
		)

		res.json({
			sucess: true,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось изменить email',
		})
	}
}
