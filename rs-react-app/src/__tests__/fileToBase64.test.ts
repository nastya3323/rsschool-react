import fileToBase64 from '../utils/fileToBase64';

describe('fileToBase64', () => {
  it('resolves with base64 string for valid file', async () => {
    const file = new File(['test content'], 'test.png', { type: 'image/png' });

    const result = await fileToBase64(file);

    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(result.length).toBeGreaterThan(0);
  });
});
