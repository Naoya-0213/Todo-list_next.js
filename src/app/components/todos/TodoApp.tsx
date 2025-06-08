import React from "react";

const TodoApp = () => {
  return (
    <div className="flex justify-center pt-[10px]">
      <section>
        <h1 className="text-center font-bold text-xl mb-10 ">
          Supabase Todo App
        </h1>
        <form>
          <input
            type="text"
            placeholder="TODOを入力"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-5"
          />
          <button className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm">
            追加
          </button>
        </form>
      </section>
    </div>
  );
};

export default TodoApp;
