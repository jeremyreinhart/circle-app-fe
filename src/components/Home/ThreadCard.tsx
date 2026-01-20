import { Button } from "../Button";

export const ThreadCard = () => {
  const dummyData = [
    {
      id: 1,
      username: "johndoe",
      fullname: "John Doe",
      content:
        "Halo semuanya! Ini adalah thread pertama saya di aplikasi Circle. Saya ingin berbagi pengalaman belajar programming, khususnya di bidang web development. Awalnya saya cukup bingung membedakan antara frontend dan backend, namun setelah mencoba React untuk frontend dan Node.js untuk backend, semuanya mulai terasa lebih masuk akal. Menurut saya, kunci utama belajar programming adalah konsistensi dan banyak praktik, bukan hanya menonton tutorial saja.",
      profile_image: "https://i.pravatar.cc/150?img=1",
      number_of_replies: 5,
    },
    {
      id: 2,
      username: "janesmith",
      fullname: "Jane Smith",
      content:
        "Akhir-akhir ini saya sedang mendalami React lebih dalam, terutama tentang state management. Saya sudah mencoba Context API, Redux, dan juga Zustand. Masing-masing punya kelebihan dan kekurangan. Context cocok untuk state kecil, Redux Toolkit sangat powerful untuk aplikasi besar, sementara Zustand terasa lebih simpel dan ringan. Menurut kalian, kapan waktu yang tepat untuk memilih salah satu dari solusi tersebut?",
      profile_image: "https://i.pravatar.cc/150?img=2",
      number_of_replies: 12,
    },
    {
      id: 3,
      username: "andrew_dev",
      fullname: "Andrew Pratama",
      content:
        "Saya ingin bertanya soal best practice dalam membuat REST API menggunakan Express.js. Selama ini saya menggunakan struktur sederhana dengan folder routes, controllers, dan services. Namun, ketika project mulai membesar, saya merasa struktur ini masih kurang rapi. Apakah sebaiknya langsung menggunakan clean architecture atau hexagonal architecture sejak awal, atau menunggu project benar-benar kompleks?",
      profile_image: "https://i.pravatar.cc/150?img=3",
      number_of_replies: 8,
    },
    {
      id: 4,
      username: "sarah_ui",
      fullname: "Sarah Wijaya",
      content:
        "Sebagai UI/UX enthusiast, saya baru saja mencoba menggunakan Tailwind CSS secara serius dalam sebuah project. Awalnya saya ragu karena class-nya terlihat sangat panjang, tapi setelah terbiasa, justru development jadi lebih cepat dan konsisten. Ditambah lagi dengan fitur responsive dan dark mode, Tailwind sangat membantu. Apakah kalian juga mengalami hal yang sama saat pertama kali mencobanya?",
      profile_image: "https://i.pravatar.cc/150?img=4",
      number_of_replies: 3,
    },
    {
      id: 5,
      username: "backend_budi",
      fullname: "Budi Santoso",
      content:
        "Dalam beberapa bulan terakhir, saya fokus mengembangkan backend menggunakan Prisma dan PostgreSQL. Yang paling saya suka dari Prisma adalah type-safety dan kemudahan saat menulis query. Namun, saya sempat mengalami masalah performa ketika relasi tabel mulai kompleks. Akhirnya saya belajar tentang indexing, connection pooling, dan optimasi query. Pengalaman ini benar-benar membuka mata saya tentang pentingnya desain database yang baik.",
      profile_image: "https://i.pravatar.cc/150?img=5",
      number_of_replies: 10,
    },
  ];
  return (
    <section className="pt-4 border-l pl-5 max-w-4xl border-r">
      <h1 className="text-white">Home</h1>
      <div className="flex gap-5 mt-5">
        <img
          src="https://i.pravatar.cc/150?img=3"
          alt=""
          className="rounded-full w-10 h-10"
        />
        <input
          type="text"
          placeholder=" What is happening?!"
          className="w-140 text-white font-semibold text-xl"
        />
        <label className="hover cursor-pointer">
          <input type="file" accept="image/*" className="hidden" />
          <i className="bi bi-file-earmark-arrow-up text-3xl text-gray-500"></i>
        </label>
        <Button
          clasName="bg-green-800 text-white text-center w-20 rounded-2xl"
          typebut="submit"
          text="Post"
        />
      </div>
      <div className="mt-5">
        {dummyData.map((datas) => (
          <div key={datas.id} className="flex gap-3 mb-3 text-white">
            <img
              src={datas.profile_image}
              alt=""
              className="rounded-full w-15 h-15"
            />
            <div>
              <div className="flex">
                <h1>{datas.fullname}</h1>
                <h2>@{datas.username}</h2>
              </div>
              <p className="text-justify mr-5">{datas.content}</p>
              <p>
                <i className="bi bi-chat-left-text"></i>
                <span>{datas.number_of_replies} Replies</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
