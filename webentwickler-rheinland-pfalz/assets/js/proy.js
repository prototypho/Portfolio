/* Animación de entrada para proyectos */
const projectCards = document.querySelectorAll(".project-card");

const observerProjects = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show-project");
        observerProjects.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

projectCards.forEach((card, i) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = `opacity .6s ${(i * 0.1)}s ease, transform .6s ${(i * 0.1)}s ease`;
  observerProjects.observe(card);
});


