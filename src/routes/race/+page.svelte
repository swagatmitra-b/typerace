<script>
  import { username } from "../../stores/store";
  import { goto } from "$app/navigation";

  let user = $state("");
  let roomId = $state("");

  const joinRoom = () => {
    if (!user) return;
    goto(`/race/${roomId}`);
  };

  const createRoom = () => {
    if (!user) return;
    const id = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    goto(`/race/${id}`);
  };

  $effect(() => {
    username.set(user);
  });

</script>

<main class="flex min-h-screen justify-center items-center">
  <div class="flex flex-col p-4 border border-black rounded-md gap-3">
    <div class="flex justify-between gap-2">
      <label for="name">Name</label>
      <input
        name="name"
        type="text"
        bind:value={user}
        class="border border-black rounded-md p-1"
      />
    </div>
    <div class="flex justify-between gap-2">
      <label for="room">RoomID</label>
      <input
        name="room"
        type="text"
        bind:value={roomId}
        class="border border-black rounded-md p-1"
      />
    </div>
    <div class="flex flex-col gap-3">
      <button onclick={createRoom} class="p-2 border border-black rounded-md"
        >Create Room</button
      >
      <button onclick={joinRoom} class="p-2 border border-black rounded-md"
        >Join Room</button
      >
    </div>
  </div>
</main>
