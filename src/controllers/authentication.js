/**
 * A Register Controller
 */

import { validationResult } from 'express-validator';
import express from "express";

import { getConnection } from 'typeorm';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
export const register = async (req, res) => {
  console.log(req.formErrorFields);
  // errors
  const formErrors = req.formErrors? req.formErrors: [];

  // input fields
  const inputs = [{
    name: 'email',
    label: 'E-mail',
    type: 'text',
    value: req.body?.email? req.body.email: '',
    error: req.formErrorFields?.email ? req.formErrorFields.email: '',
  }, {
    name: 'password',
    label: 'Password',
    type: 'password',
    value: req.body?.password? req.body.password: '',
    error: req.formErrorFields?.password ? req.formErrorFields.password: '',
  }]

  // render the register page
  res.render('register', {
    layout: 'authentication',
    inputs,
    formErrors,
  });
}

export const postRegister = async (req, res, next) => {
  console.log(req.formErrorFields);
  try {
    
    const error = validationResult(req);
    if(!error.isEmpty()) {
      req.formErrorFields = {};
      errors.array().forEach(({ msg, param })=>{req.formErrorFields[param] = msg});
      return next()
    }
    else {
      const userRepository = getConnection().getRepository('User');
       const user = await userRepository.findOne({
        where: { email : req.body.email}
      });
      
      if(user) {
        req.formErrors = [{message: "Gebruiker bestaat"}];
        return next();
      }
      

      const hashedPassword = bcrypt.hashSync(req.body.password , 14);
      await userRepository.save({
        email: req.body.email,
        password: hashedPassword
      });

      res.redirect('/login')
    }
    
  } catch (error) {
    next(error.message)
  }
}

export const postLogin = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if(!error.isEmpty()) {
      req.formErrorFields = {};
      errors.array().forEach(({ msg, param })=>{req.formErrorFields[param] = msg});
      return next()
    }
    else {
      const userRepository = getConnection().getRepository('User');
      const user= await userRepository.findOne({
        where: { email : req.body.email}
      });

      if(!user) {
        req.formErrors = [{message: "Gebruiker is onbekend"}];
        return next();
      }

      const isEqual =  bcrypt.compareSync(req.body.password, user.password);

      if(!isEqual){
        req.formErrors = [{message: "Wachtword is onjuist"}];
        return next();
      }
      
      const token = jwt.sign(
        {userId: user.id , email: user.email},
        process.env.TOKEN_SALT,
        {expiresIn: '1h'}
      )

      res.cookie('token', token, {httpOnly: true});
      res.redirect('/')
    }
    
  } catch (error) {
    next(error.message)
  }
}

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    return res.redirect('/login')
  } catch (error) {
    next(error.message)
  }
}

export const login = async (req, res) => {
  
  if( req.cookies.token ) {
    res.redirect('/');
    return;
  }
  // errors
  const formErrors = req.formErrors? req.formErrors: [];


  // input fields
  const inputs = [{
    name: 'email',
    label: 'E-mail',
    type: 'text',
    value: req.body?.email? req.body.email: '',
    error: req.formErrorFields?.email ? req.formErrorFields.email: '',
  }, {
    name: 'password',
    label: 'Password',
    type: 'password',
    value: req.body?.password? req.body.password: '',
    error: req.formErrorFields?.password ? req.formErrorFields.password: '',
  }]

  // render the login page
  res.render('login', {
    layout: 'authentication',
    inputs,
    formErrors
  });
}