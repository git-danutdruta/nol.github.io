import { describe, it, expect } from 'vitest';
import axe from 'axe-core';

describe('axe-core rules', () => {
  it('has no critical or serious violations in a minimal accessible document', () => {
    document.body.innerHTML = `
      <main>
        <h1>Accessible heading</h1>
        <button>Action</button>
        <label for="input">Name</label>
        <input id="input" type="text" />
      </main>
    `;

    return axe.run(document.body).then((results) => {
      const violations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(violations).toHaveLength(0);
    });
  });
});
