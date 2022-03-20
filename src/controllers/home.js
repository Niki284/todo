/**
 * A Home Controller
 */

import { getConnection } from 'typeorm';

export const home = async (req, res) => {
  // get the user repository
  const userRepository = getConnection().getRepository('User');
  const naviReposity = getConnection().getRepository('NavigationItem');
  const todoReposity = getConnection().getRepository('TodoItem');
  const todos = await todoReposity.find();
  const navi = await naviReposity.find();

  // console.log(req.user)

  // for DEMO, return the first user in the users table
  const userData = await userRepository.findOne({
    where: { id: req.user?.userId },
    relations: [ "user_meta" ]
  });

  // render the home page
  res.render('home', {
    userData,
    navi,
    todos,
  });


}



export const homePostTodo = async (req, res, next) => {
  try {
    // validate incoming body
    if (!req.body.name) throw new Error('Please provide a name for an todo.');
    // get the repository from
    const todoReposity = getConnection().getRepository('TodoItem');
    // get todo (if this one exists)
    let todo = await todoReposity.findOne({
      where: { name: req.body.name },
    });
    // if ineterest already exists
    if (!todo) {
      todo = await todoReposity.save(req.body, {
        status: 0,
      });
    }
    // redirect to home
    res.redirect('/');
  } catch (error) {
    next(error.message);
  }
};
export const homeDeleteTodo = async (req, res, next) => {
  console.log(req.body);
  try {
    const { id } = req.body;
    // get the repository from
    const todoReposity = getConnection().getRepository('TodoItem');
    // get todo (if this one exists)
    const todo = await todoReposity.findOne({ id });
    // if ineterest already exists
    if (!todo) throw new Error(`del de todo op id : ${id}`);
    await todoReposity.remove({ id });
    // redirect to home
    res.redirect('/');
  } catch (error) {
    next(error.message);
  }
};

export const homeUpdateTodo = async (req, res, next) => {
  try {
    // validate incoming body
    if (!req.body.name) throw new Error('Please provide a name for an todo.');
    // get the repository from
    const todoReposity = getConnection().getRepository('TodoItem');
    // get todo (if this one exists)
    let todo = await todoReposity.findOne({
      where: { id: req.body.name },
    });
    // if ineterest already exists
    if (!todo) {
      todo = await todoReposity.save(req.body, {
        status: 0,
      });
    }
    // redirect to home
    res.redirect('/');
  } catch (error) {
    next(error.message);
  }
};