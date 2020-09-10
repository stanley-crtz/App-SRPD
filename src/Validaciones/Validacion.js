class Validacion {


    ValidatorSelect(value, data) {
        var status = false;
    
        data.map((val, i) => {
            if (val.value === value) {
                status = true;
                
            }
            return val;
        });
        
        return status;
    }

    ValidatorSelectMunicipios(value, data) {
        var status = false;
        
        data.map((val, i) => {
            if (val.label === value) {
                status = true;
                
            }
            return val;
        });
        
        return status;
    }

    ValidatorSelectCreate(value, data, option) {
        var status = false;
    
        if (option === "Universidad") {
            data.map((val, i) => {
                if (val.value.Universidad === value) {
                    status = true;
                    
                }
                return val;
            });
        } else {
            data.map((val, i) => {
                if (val.value === value) {
                    status = true;
                    
                }
                return val;
            });
        }
        
        return status;
    }

    ChangeStep(e) {

        let progressOptions = document.querySelectorAll('.progressbar__option');
        

        if (e.next || e.back) {
            let currentStep = document.getElementById('step-' + e.step);
            let jumpStep = document.getElementById('step-' + e.to_Step);
            currentStep.addEventListener('animationend', function callback() {

                setTimeout(() => {
                    jumpStep.classList.add('visible');
                }, 500)
                
                
                currentStep.classList.remove('active');
                jumpStep.classList.add('active');
                
                if (e.next) {
                    
                    currentStep.classList.add('to-left');
                    progressOptions[e.to_Step - 1].classList.add('active');
                } else {
                    
                    jumpStep.classList.remove('to-left');
                    progressOptions[e.step - 1].classList.remove('active');
                }
                currentStep.removeEventListener('animationend', callback);
            });
            currentStep.classList.add('inactive');
            jumpStep.classList.remove('inactive');
            currentStep.classList.add('visible');
            jumpStep.classList.remove('visible');

            setTimeout(() => {
                currentStep.classList.remove('visible');
            }, 1000)
        }
    }

    isJson(item) {
        item = typeof item !== "string"
            ? JSON.stringify(item)
            : item;
    
        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }
    
        if (typeof item === "object" && item !== null) {
            return true;
        }
    
        return false;
    }

}
  
export default new Validacion();
