import express from "express";
import { getTracks, getTrackById } from "#db/queries/tracks";

const router = express.Router();

router.route("/").get(async (req, res) => {
    const tracks = await getTracks();
    return res.status(200).send(tracks);
});

router.param("id", async (req, res, next, id) => {
    const track = await getTrackById(id);
    if (!track) {
        return res.status(404).send("Track not found.");
    } 

    req.track = track;
    next();
});

router.route("/:id").get(async (req, res) => {
    const {id} = req.params;
    const track = await getTrackById(id);
    if (!track) {
        return res.status(404).send("Track not found.");
    } 
    return res.status(200).send(track);
});


export default router;
