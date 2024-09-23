import { SupabaseClient } from "@supabase/supabase-js";
import { SpotifyUserPlaying, MockUserPlaying } from "../src/UserPlaying";
import dotenv from "dotenv";
dotenv.config();

describe("UserPlaying Tests", () => {
  let supabase: SupabaseClient;
  describe("UserPlaying Tests", () => {
    let supabase: SupabaseClient;
    let userId: string;
    let context: any;
    let email: string = "test@test.com"
    let password: string = "password"

    beforeAll(async () => {
      supabase = new SupabaseClient(
        process.env.SB_URL as string,
        process.env.ANON as string
      );
      const { data, error } = await supabase.auth.signUp({
        email: "test1@example.com",
        password: "password",
      });
      if (error) throw error;
      userId = data.user?.id || "test-user-id";
      context = { refresh_token: "test-refresh-token" };
    });
    afterAll(async () => {
      supabase = new SupabaseClient(
        process.env.SB_URL as string,
        process.env.SERVICE as string
      );
      const {data, error} = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    });

    // test("SpotifyUserPlaying init method", async () => {
    //   const spotifyUserPlaying = new SpotifyUserPlaying(
    //     supabase,
    //     userId,
    //     context
    //   );
    //   await expect(spotifyUserPlaying.init()).resolves.not.toThrow();
    // });

    test("MockUserPlaying init method", async () => {
      const mockUserPlaying = new MockUserPlaying(supabase, userId, context);
      await expect(mockUserPlaying.init()).resolves.not.toThrow();
    });

    test("MockUserPlaying fire method", async () => {
      const mockUserPlaying = new MockUserPlaying(supabase, userId, context);
      await mockUserPlaying.init();
      await expect(mockUserPlaying.fire()).resolves.not.toThrow();
    });

    test("SpotifyUserPlaying fire method", async () => {
      const spotifyUserPlaying = new SpotifyUserPlaying(
        supabase,
        userId,
        context
      );
      await spotifyUserPlaying.init();
      await expect(spotifyUserPlaying.fire()).resolves.not.toThrow();
    });

    test("MockUserPlaying data integrity", async () => {
      const mockUserPlaying = new MockUserPlaying(supabase, userId, context);
      await mockUserPlaying.init();
      await mockUserPlaying.fire();
      expect(mockUserPlaying.mockData).toHaveLength(2);
      expect(mockUserPlaying.mockData[0].trackName).toBe("Test Track");
    });
  });
});
