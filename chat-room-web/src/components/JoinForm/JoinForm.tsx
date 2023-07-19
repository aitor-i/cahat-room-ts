import { useJoinForm } from "./useJoinForm";

export const JoinForm = () => {
  const { submitHandler } = useJoinForm();

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col  border-1 w-fit p-10 pt-2 pb-10 border-gray-200 gap-4 "
    >
      <span className="flex flex-col gap-2">
        <label>Enter your name</label>
        <input
          name="username"
          required
          className="border-2 rounded-lg"
          type="text"
        />
      </span>
      <span className="flex flex-col gap-2">
        <span className="flex flex-col gap-2">
          <label>Enter room name</label>
          <input
            name="room-name"
            required
            className="border-2 rounded-lg"
            type="text"
          />
        </span>
      </span>
      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 p-2 rounded-lg text-gray-50 font-bold"
      >
        Join
      </button>
    </form>
  );
};
