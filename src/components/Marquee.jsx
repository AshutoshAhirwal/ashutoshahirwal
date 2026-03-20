import React from 'react';

const Marquee = () => {
  const tags = [
    'Drupal 8', 'Drupal 9', 'Drupal 10', 'Drupal 11', 'Twig', 'SDC', 'Layout Builder', 
    'Storybook', 'Pattern Lab', 'SCSS', 'Tailwind', 'PHP', 'Composer', 'Drush', 'Git', 
    'Pantheon', 'Jira', 'VS Code', 'Bootstrap', 'Accessibility', 'SEO', '105+ Credits', 
    'Specbee', 'Dotsquares'
  ];

  return (
    <div className="mwrap">
      <div className="mtr" id="mq">
        {[...tags, ...tags].map((tag, i) => (
          <div key={i} className="mtg">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
