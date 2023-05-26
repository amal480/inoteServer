const express = require('express');
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { body, validationResult } = require('express-validator');



//Route 1:Get all the notes /api/notes/getnotes:GET .Login required
router.get('/getnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})
//Route 2:Add a new note using POST /api/notes/addnote .Login required
router.post('/addnote', fetchuser, [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save()
        res.json(savednote)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

//Route 3:Update an already existing note using PUT /api/notes/updatenote .Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //create a newnote object
        const newnote ={};
        if(title){newnote.title=title}
        if(description){newnote.description=description}
        if(tag){newnote.tag=tag}

        //Find the note to be updated
        const note=await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not found")
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not allowed")
        }

        updatednote=await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
        res.json(updatednote)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

//Route 4:Delete an already existing note using DELETE /api/notes/delete .Login required
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be deleted
        let note=await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not found")
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not allowed")
        }

        // delno=await Notes.deleteOne({_id:`${req.params.id}`})
        // res.json(delno)
        //or
        note=await Notes.findByIdAndDelete(req.params.id)
        res.json({note:note})
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})


module.exports = router