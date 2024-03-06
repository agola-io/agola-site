---
layout: home
---

<style>
.home {
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  max-width: 960px;
  margin: 0 auto;
  display: block
}

.home .hero {
  text-align: center
}

.home .hero img {
  max-width: 100%;
  max-height: 280px;
  display: block;
  margin: 3rem auto 1.5rem
}

.home .hero .description {
  max-width: 35rem;
  font-size: 1.6rem;
  line-height: 1.3;
  color: #6a8bad;
  margin: 1.8rem auto;
}

.home .hero .action-button {
  display: inline-block;
  font-size: 1.2rem;
  color: #fff;
  background-color: #f37021;
  padding: .8rem 1.6rem;
  border-radius: 4px;
  transition: background-color .1s ease;
  box-sizing: border-box;
  border-bottom: 1px solid #ec610d;
  text-decoration: none;
}

.home .logo {
  display: inline;
  margin: 0.3rem;
  height:60px;
}

.home .features {
  border-top: 1px solid #eaecef;
  padding: 1.2rem 0;
  margin-top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: stretch;
  justify-content: space-between
}

.home .feature {
  flex-grow: 1;
  flex-basis: 30%;
  max-width: 30%
}

.home .feature p {
  color: #4e6e8e;
}

.home .feature .title {
  display: block;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.25;
  border-bottom: none;
  padding-bottom: 0;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  color: #3a5169;
}

.center {
  text-align: center;
}

.roundedbutton {
  position: relative;
  display: inline-block;
  margin: 0 2em;
  margin-top: 1em;
  padding: 0.75em 2em;
  border: 1px solid #4fc08d;
  border-radius: 2em;
  border-color: #f6f6f6;
  text-indent: 1.4em;
}

a.roundedbutton {
  color: #4f5959;
  background-color: #f6f6f6;
  font-size: 1.05em;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-align: center;
  text-decoration: none;
}

.roundedbutton svg {
  position: absolute;
  left: 0.4em;
  top: 0.4em;
  width: 2em;
}
</style>

<div class="home">
<header class="hero"><img src="/agola-logo-name.svg" alt="hero">
  <p class="description">
    CI/CD redefined
  </p>
  <div>
    <a href="/tryit/" class="nav-link action-button">
    Try it now
    </a>
  </div>
</header>

<div class="center">
  <a class="roundedbutton" href="https://github.com/agola-io/agola" target="_blank">
    <svg aria-labelledby="simpleicons-github-dark-icon" lang="" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title id="simpleicons-github-icon" lang="en">GitHub Dark icon</title>
      <path fill="#7F8C8D" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
    </svg>
    GITHUB
  </a>
  <a class="roundedbutton" href="https://talk.agola.io" target="_blank">
    <svg lang="" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 299.99 299.99">
        <path fill="#7F8C8D" d="M149.995,0C67.158,0,0,67.156,0,149.995S67.158,299.99,149.995,299.99c82.839,0,149.995-67.156,149.995-149.995 S232.834,0,149.995,0z M89.481,211.219l-37.176,9.959l10.177-37.973c-7.01-12.05-11.051-26.05-11.051-40.997 c0-45.074,36.541-81.618,81.62-81.618c45.071,0,81.615,36.544,81.615,81.618c0,45.074-36.544,81.62-81.615,81.62 C117.023,223.832,102.091,219.199,89.481,211.219z M247.76,236.976l-33.818-9.059c-11.477,7.257-25.057,11.474-39.63,11.474 c-10.39,0-20.271-2.142-29.248-5.999c45.064-5.9,79.981-44.527,79.981-91.177c0-13.518-2.959-26.351-8.216-37.926 c19.182,13.427,31.73,35.67,31.73,60.853c0,13.596-3.673,26.33-10.05,37.293L247.76,236.976z"/>
    </svg>
    FORUM
  </a>
</div>

<div class="features">
  <div class="feature">
    <p class="title">Containerized, reproducible and restartable Runs</p>
    <p>Execute your runs in a reproducible containerized environment. Restart them from start or from failed task</p>
  </div>
  <div class="feature">
    <p class="title">Advanced workflows (matrix builds, fan-in, fan-out, multi arch etc...)</p>
    <p>Implement every kind of workflow you want from simple builds to complex deployments.</p>
  </div>
  <div class="feature">
    <p class="title">Multiple git sources integrations</p>
    <p>GitHub, GitLab, Gitea, custom Git repositories (and more to come)</p>
    <img class="logo" src="/github-logo.svg"/>
    <img class="logo" src="/gitlab-logo.svg"/>
    <img class="logo" src="/gitea-logo.svg"/>
  </div>
  <div class="feature">
    <p class="title">Multiple execution platforms</p>
    <p>Execute you tasks inside a Kubernetes cluster, local docker etc...</p>
    <img class="logo" src="/k8s-logo.svg"/>
    <img class="logo" src="/docker-logo.svg"/>
  </div>
  <div class="feature">
    <p class="title">Testable Runs</p>
    <p>Keep the same Runs definition but use different variables values based on rules to test your runs on multiple environments.</p>
  </div>
  <div class="feature">
    <p class="title">Enhance and leverage your git workflow</p>
    <p>Runs definitions are committed inside your git repositories and triggered upon push/tag/pull request.</p>
  </div>
  <div class="feature">
    <p class="title">Users Direct Runs</p>
    <p>Execute user runs from your local git repository on agola <a href="/doc/concepts/user_direct_runs.html" class="nav-link action-button">with just one command</a> (also without the need to commit/push)</p>
  </div>
  <div class="feature">
    <p><a href="/about/features/" class="nav-link action-button">Read More</a></p>
  </div>
</div>
</div>
