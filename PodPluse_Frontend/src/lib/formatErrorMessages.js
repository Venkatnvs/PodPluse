const formatErrorMessages = (error) => {
  if (!error) return "<p>Unknown error occurred</p>";

  if (typeof error === 'string') return `<p>${error}</p>`;

  if (error.non_field_errors) {
    return error.non_field_errors.map(msg => `<p>${msg}</p>`).join('');
  }

  if (error.errors) {
    return Object.entries(error.errors).map(([field, messages]) => {
      return `<p><strong class="capitalize">${field}:</strong> ${messages.join(', ')}</p>`;
    }).join('');
  }

  return "<p>Unknown error occurred</p>";
}


export default formatErrorMessages;
