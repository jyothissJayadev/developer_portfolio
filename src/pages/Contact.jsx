const Contact = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-5xl font-bold mb-4">Let's talk.</h2>
        <a
          href="mailto:hello@example.com"
          className="text-2xl text-indigo-400 hover:underline"
        >
          hello@yourname.com
        </a>
      </div>
    </div>
  );
};
export default Contact;
