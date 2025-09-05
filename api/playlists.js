import express from "express";
import {createPlaylist, getPlaylistById, getPlaylists} from "#db/queries/playlists";
import { createTrackToPlaylistTracks} from "../db/queries/playlists_tracks.js"
import { getTracksByPlaylistId } from "../db/queries/tracks.js";

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const playlists = await getPlaylists();
    return res.status(200).send(playlists);
  })
  .post(async (req, res) => {
    if (!req.body) {
      return res.status(400).send("Request body is required.");
    }
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).send("Request body requires: name, description");
    }
    const playlist = await createPlaylist(name, description);
    return res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) {
    return res.status(404).send("Playlist not found.");
  }
  req.playlist = playlist;
  next();
});

router.route("/:id").get((req, res) => {
  return res.status(200).send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    const playlist = await getTracksByPlaylistId(req.playlist.id);
    return res.status(200).send(playlist);
  })
  .post(async (req, res) => {
    if (!req.body) {
      return res.status(400).send("Request body is required.");
    }
    const { trackId } = req.body;
    if (!trackId) {
      return res.status(400).send("Request body requires: trackId");
    } 

    const playlistTracks = await createTrackToPlaylistTracks(req.playlist.id, trackId);
    return res.status(201).send(playlistTracks);
  });

  export default router;