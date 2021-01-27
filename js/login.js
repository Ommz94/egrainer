function loginForm() {
    return {
        formData: {
            username: '',
            password: ''
        },
        errormessage: '',
        submitData() {
			this.errormessage = ''

			fetch('https://egrainer-backend.herokuapp.com/login/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.formData)
            })
			.then(() => {
				this.errormessage = 'Form sucessfully submitted!'
			})
			.catch(() => {
				this.errormessage = 'Ooops! Something went wrong!'
			})
		}
	}
}