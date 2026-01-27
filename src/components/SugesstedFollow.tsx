export const SugesstedFollow = () => {
  return (
    <div className="bg-neutral-900 flex flex-col p-5 gap-5">
      <h1 className="text-white font-semibold text-2xl flex">
        Suggested for you
      </h1>
      <div className="flex gap-4">
        <img
          src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="text-white">
          <p>Mohammad Jawahir</p>
          <p>@em.jawahir</p>
        </div>
        <button className="text-white rounded-2xl border w-22 h-7 text-lg font-semibold cursor-pointer hover:bg-neutral-600 ml-25">
          Follow
        </button>
      </div>
    </div>
  );
};
