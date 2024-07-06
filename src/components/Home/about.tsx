import GitLG  from '../../assets/svg/github-2.svg';
import LinkedLG  from '../../assets/svg/linkedin.svg';

const About = () => (
    <section className="px-[4.5rem] overflow-hidden bg-light_background">
        <div className="mt-4 py-8 text-3xl flex flex-col">
            <div className="">
                <h5 className="text-secondary">
                    connect with abisola on <span className="text-xl">&#9660;</span>
                </h5>
                <div className="md:ml-40 mt-4 flex">
                    <a
                        href="https://github.com/Abisola-Morohunfolu"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="border-b-3 border-primary mx-8"
                    >
                        <span className="sr-only">View Abisola github</span>
                        <img src={GitLG} className="w-24" alt="github icon"/>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/bisola-morohunfolu-833354195/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="border-b-3 border-primary mx-8"
                    >
                        <span className="sr-only">View Abisola LinkedIn profile</span>
                        <img src={LinkedLG} className="w-24" alt="linkedin icon"/>
                    </a>
                    <a
                        href="mailto:bisola.morohunfolu@gmail.com"
                        className="max-w-max text-secondary shadow-primary transition-all ease-in-out duration-400 hover:tracking-wider"
                    >
                        send me a mail
                    </a>
                </div>
            </div>

        </div>
    </section>
);

export default About;
