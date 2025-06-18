const Thought = require("../models/Thought");
const User = require("../models/User");

const { Op } = require('sequelize')

module.exports = class ThoughtsController {
  static async showThoughts(req, res) {

    let search = ''

    if(req.query.search) {
      search = req.query.search
    }

    let order = 'DESC'

    if(req.query.order === 'old') {
      order = 'ASC'
    } else {
      order = 'DESC'
    }  

    const thoughtsData = await Thought.findAll({
      include: User, 
      where: {
        title: {[Op.like]: `%${search}%`}
      },
      order: [['createdAt', order]]
      })

    const thoughts = thoughtsData.map((t) => t.get({plain: true}))

    let thoughtsQty = thoughts.length

    if(thoughtsQty === 0) {
      thoughtsQty = false
    }

    res.render("thoughts/home", { thoughts, search, thoughtsQty });
  }

  static async dashboard(req, res) {
    const id = req.session.userid;

    const user = await User.findOne({
      where: { id: id },
      include: Thought,
      plain: true,
    });

    // check if user exists
    if (!user) {
      res.redirect("/login");
    }

    const thoughts = user.Thoughts.map((t) => t.dataValues);

    let emptyThoughts = thoughts.length === 0 ? true : false;

    res.render("thoughts/dashboard", { thoughts, emptyThoughts });
  }

  static createThought(req, res) {
    res.render("thoughts/create");
  }

  static async createThoughtSave(req, res) {
    const thought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Thought.create(thought);
      req.flash("message", "Pensamento criado com sucesso!");
      req.session.save(() => {
        res.redirect("/thoughts/dashboard");
      });
    } catch (error) {
      console.log("Houve um erro: " + error);
    }
  }

  static async removeThought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Thought.destroy({ where: { id: id, UserId: UserId } });

      req.flash("message", "Pensamento removido com sucesso!");

      req.session.save(() => {
        res.redirect("/thoughts/dashboard");
      });
    } catch (error) {
      console.log("Houve um erro: " + error);
    }
  }

  static async editThought(req, res) {
    const id = req.params.id;

    const thought = await Thought.findOne({ where: { id: id }, raw: true });

    res.render("thoughts/edit", { thought });
  }

  static async editThoughtSave(req, res) {
    const id = req.body.id;

    const thought = {
      title: req.body.title,
    };

    try {
      await Thought.update(thought, { where: { id: id } });

      req.flash("message", "Pensamento atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/thoughts/dashboard");
      });
    } catch (error) {
      console.log("Houve um erro: " + error);
    }
  }
};
