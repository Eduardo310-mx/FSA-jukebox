import db from "#db/client";
import { faker } from '@faker-js/faker';
import { createTrack } from "./queries/tracks.js"
import { createPlaylist } from "./queries/playlists.js";
import { createTrackToPlaylistTracks } from "./queries/playlists_tracks.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");



async function seed() {
  const trackIds = [];
  const playlistIds = [];
  const trackToPlayList = [];

  // create 20 tracks
  for (let i = 0; i < 20; i++) {
    const name = faker.music.songName();
    const duration_ms = faker.number.int({ min: 1200, max: 4000 });
    const track = await createTrack(name, duration_ms);
    trackIds.push(track.id);
  }

  // create 10 playlists
  for (let i = 0; i < 10; i++) {
    const name = faker.word.words({ count: { min: 1, max: 3 } });
    const description = faker.lorem.sentence();
    const playlist = await createPlaylist(name, description);
    playlistIds.push(playlist.id);
  }

  // create 15 playlists
  for (let i = 0; i < 15; i++) {
    const playlist_id = faker.helpers.arrayElement(playlistIds);
    const track_id = faker.helpers.arrayElement(trackIds);
    const toPlaylist = await createTrackToPlaylistTracks(playlist_id, track_id);
    trackToPlayList.push(toPlaylist.id);
  }

}

