import React, { useMemo, useState } from 'react';
import { Link, useForm, usePage, router} from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

import AuthLayout from '@/layouts/auth-layout';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '../../components/ui/button';
import TextInput from '../../components/text-input';
import TextLink from '../../components/text-link';
import logo from '../../assets/logotracer.png';



export default function AlumnaSignup() {
  const [step, setStep] = useState(1);
  const [passwordErrors, setPasswordErrors] = useState([]);


  const { props } = usePage();

  //form
  const INITIAL_FORM = {
  last_name: '',
  first_name: '',
  middle_name: '',
  address: '',
  contact_number: '',
  email: '',
  password: '',
  password_confirmation: '',
  courses: '',
  school_year: '',
  start_year: '',
  end_year: '',
  semester:'',
  user_role: '',

  currently_employed: '',
  employment_type: '',
  company_name: '',
  position: '',
  location: '',
  monthly_salary: '',
  employment_start_year: '',
  employment_end_year: '',
  is_current: true,
  unemployment_reason: '',
};

//useform
  const { data, setData, post, errors, processing, transform } = useForm(INITIAL_FORM);

  //returns the user to the error field
  useEffect(() => {
      const step1Fields = [
        'last_name',
        'first_name',
        'middle_name',
        'address',
        'contact_number',
        
      ];

      const step2Fields = [
        'courses',
        'start_year',
        'end_year',
        'semester',
      ]

      const step3Fields = [
        'email',
        'password',
        'password_confirmation',
      ]
      const step4Fields = ['currently_employed'];

      const step5Fields = [
        'employment_type',
        'company_name',
        'position',
        'location',
        'monthly_salary',
        'employment_start_year',
        'employment_end_year',
      ];

      const step6Fields = ['unemployment_reason'];

      if (step1Fields.some((field) => errors[field])) {
        setStep(1);
        return;
      }

      if (step2Fields.some((field) => errors[field])) {
        setStep(2);
        return;
      }

      if (step3Fields.some((field) => errors[field])) {
        setStep(3);
        return;
      }

      if (step4Fields.some((field) => errors[field])) {
        setStep(4);
        return;
      }

      if (step5Fields.some((field) => errors[field])) {
        setStep(5);
        return;
      }

      if (step6Fields.some((field) => errors[field])) {
        setStep(6);
      }
    }, [errors]);


const PERSONAL_FIELDS = [
  { name: 'last_name', placeholder: 'Lastname', type: 'text' },
  { name: 'first_name', placeholder: 'Firstname', type: 'text' },
  { name: 'middle_name', placeholder: 'Middlename', type: 'text' },
  { name: 'address', placeholder: 'Address', type: 'text' },
  { name: 'contact_number', placeholder: 'Contact Number', type: 'number' },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'Permanent/Regular', label: 'Permanent/Regular' },
  { value: 'Probationary', label: 'Probationary' },
];

const EMPLOYED_FIELDS = [
  {
    name: 'company_name',
    placeholder: 'Name of Company',
    type: 'text',
  },
  {
    name: 'position',
    placeholder: 'Position in the Company',
    type: 'text',
  },
  {
    name: 'location',
    placeholder: 'Location of Company',
    type: 'text',
  },
  {
    name: 'monthly_salary',
    placeholder: 'Monthly Salary (Optional)',
    type: 'number',
  },
];

const COURSE_OPTIONS = [
  {
    value: 'BSCpE',
    label: 'Bachelor of Science in Computer Engineering',
  },
  {
    value: 'BSECE',
    label: 'Bachelor of Science in Electronic Engineering',
  },
  {
    value: 'BSIT',
    label: 'Bachelor of Science in Information Technology',
  },
];

const EMPLOYMENT_CURRENT_YEAR = new Date().getFullYear();
const EMPLOYMENT_START_YEAR = 2018;
const GRADUATED_START_YEAR = 2017;
const GRADUATED_END_YEAR = 2022;

//year options
const yearOptions = useMemo(
  () =>
    Array.from({ length: GRADUATED_END_YEAR - GRADUATED_START_YEAR }, (_, index) => {
      const startYear = GRADUATED_START_YEAR + index;
      const endYear = startYear + 1;

      return {
        value: `${startYear}-${endYear}`,
        label: `${startYear}-${endYear}`,
      };
    }),
  []
);


const employmentYearOptions = useMemo(
  () =>
    Array.from(
      { length: EMPLOYMENT_CURRENT_YEAR - EMPLOYMENT_START_YEAR + 1 },
      (_, index) => {
        const year = EMPLOYMENT_CURRENT_YEAR - index;

        return {
          value: String(year),
          label: String(year),
        };
      }
    ),
  [EMPLOYMENT_CURRENT_YEAR]
);

const SEMESTER = [
  {
    value: '1st Semester',
    label: '1st Semester',
  },
  {
    value: '2nd Semester',
    label: '2nd Semester',
  },
  {
    value: '3rd Semester',
    label: '3rd Semester',
  },
  {
    value: 'Summer',
    label: 'Summer',
  },
]

//submit
const handleSubmit = (e) => {
  e.preventDefault();

  const [start_year, end_year] = data.school_year.split('-');

  post('/alumna/signup', {
    preserveScroll: true,
    data: {
      ...data,
      start_year,
      end_year,
      employment_end_year: data.is_current ? null : data.employment_end_year,
    },
    onSuccess: () => {
      setData(INITIAL_FORM);
      setStep(1);            
    },
  });
};

  const handleChange = ({ target: { name, value } }) => {
    setData(name, value);
    
    // Validate password on change
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one capital letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
      errors.push('Password must contain at least one symbol (!@#$%^&*(),.?":{}|<>_)');
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSelectChange = (name, value) => {
    if (name === 'employment_end_year') {
    if (value === 'current') {
      setData({ ...data, is_current: true, employment_end_year: 'current' });
    } else {
      setData({ ...data, is_current: false, employment_end_year: value });
    }
    return;
  }
  setData(name, value);
  };

  const isStepOneComplete = [
    data.last_name,
    data.first_name,
    data.address,
    data.contact_number,
  ].every(Boolean);

  const isStepTwoComplete = [
    data.courses,
    data.school_year,
    data.semester,
  ].every(Boolean);

  const isStepThreeComplete = [
    data.email,
    data.password,
    data.password_confirmation,
  ].every(Boolean) && passwordErrors.length === 0;

  const nextStep = () => {
  if (step === 1 && isStepOneComplete) {
    setStep(2);
    return;
  }

  if (step === 2 && isStepTwoComplete) {
    setStep(3);
    return;
  }

  if (step === 3 && isStepThreeComplete) {
    setStep(4);
    return;
  }

  if (step === 4) {
    if (data.currently_employed === 'Yes') {
      setStep(5);
    } else if (data.currently_employed === 'No') {
      setStep(6);
    }
  }
};

  const prevStep = () => {
    if (step === 5 || step === 6) {
      setStep(4);
    }

    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

 

  return (
    <Card className=" relative w-full max-w-lg gap-2 rounded-2xl bg-white px-4 py-6 shadow-lg sm:max-w-lg sm:px-6 sm:py-8 md:max-w-2xl md:px-8 md:py-10 max-h-[90vh]">
      <CardHeader className="relative flex flex-col items-center justify-center">
        {step === 1 && (
          <Link
            href={route('role.select')}
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
        )}

        {/* <img src={logo} alt="Alumni Connect logo" className="h-16 sm:h-10 md:h-15" />
        <p className="text-base font-bruno text-center sm:text-sm">Alumni Connect</p> */}
      </CardHeader>

      <CardContent className="custom-scrollbar overflow-y-auto px-3 py-2">
        <form id="signupForm" className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"> Personal Information</h3>
            </div>
                {PERSONAL_FIELDS.map((field) => (
                  <TextInput
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    value={data[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    error={errors[field.name]}
                    className="text-black border-gray-400 w-full text-sm sm:text-base"
                  />
                ))}
                </>
          )}

          {step === 2 && (
            <>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"> Academic Information</h3>
            </div>
            <Select
                value={data.courses}
                onValueChange={(value) => handleSelectChange('courses', value)}
              >
                <SelectTrigger className="w-full text-black border-gray-400 text-sm">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  <SelectGroup>
                    {COURSE_OPTIONS.map((course) => (
                      <SelectItem key={course.value} value={course.value}>
                        {course.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
            </Select>

            <Select
                value={data.school_year}
                onValueChange={(value) => handleSelectChange('school_year', value)}>
                <SelectTrigger className="w-full text-black border-gray-400 text-sm">
                  <SelectValue placeholder="Year Graduated" />
                </SelectTrigger>
                <SelectContent className="max-h-48" >
                  <SelectGroup >
                    {yearOptions.map((year) => (
                      <SelectItem key={year.value} value={year.value} >
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={data.semester}
                onValueChange={(value) => handleSelectChange('semester', value)}
              >
                <SelectTrigger className="w-full text-black border-gray-400 text-sm">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  <SelectGroup>
                    {SEMESTER.map((sem) => (
                      <SelectItem key={sem.value} value={sem.value}>
                        {sem.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

            </>
          )}

          {step === 3 && (
            <>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800"> Account Information</h3>
            </div>
             <TextInput
                name="email"
                type="email"
                value={data.email}
                placeholder="Email Address"
                onChange={handleChange}
                error={errors.email}
                className="text-black border-gray-400 w-full text-sm sm:text-base"
              />

              <TextInput
                name="password"
                type="password"
                value={data.password}
                placeholder="Password"
                onChange={handleChange}
                error={errors.password}
                className="text-black border-gray-400 w-full text-sm sm:text-base"
              />
              
              {passwordErrors.length > 0 && (
                <div className="text-xs text-red-600 space-y-1 mt-1">
                  {passwordErrors.map((error, index) => (
                    <div key={index} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}

              <TextInput
                name="password_confirmation"
                type="password"
                value={data.password_confirmation}
                placeholder="Confirm Password"
                onChange={handleChange}
                error={errors.password_confirmation}
                className="text-black border-gray-400 w-full text-sm sm:text-base"
              />

            </>
          )}


          {step === 4 && (
            <div className="flex w-full flex-col items-center gap-8">
              <div className="w-full">
                <p className="text-center text-[15px] text-slate-600">
                  Help us keep our alumni records updated by sharing your current
                  employment status.
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-6">
                <h2 className="text-md text-center font-semibold text-slate-900">
                  Are you currently employed?
                </h2>

                <div className="flex w-full flex-col gap-4">
                  {['Yes', 'No'].map((value) => {
                    const checked = data.currently_employed === value;
                    const label =
                      value === 'Yes' ? "Yes, I'm employed" : "No, I'm not employed";

                    return (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-3 transition-all ${
                          checked
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="currently_employed"
                          value={value}
                          checked={checked}
                          onChange={handleChange}
                          className="h-6 w-6"
                        />
                        <span className="text-md font-medium text-slate-900">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 5 && data.currently_employed === 'Yes' && (
            <div className="flex flex-col gap-4">
              <div className="p-2">
                <p>Employment Status</p>
              </div>

              <div className="flex flex-col gap-3 px-3">
                {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="employment_type"
                      value={option.value}
                      checked={data.employment_type === option.value}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <span className="text-md text-slate-900">{option.label}</span>
                  </label>
                ))}
              </div>

              <div className='flex flex-col gap-3'>
              <Select
                value={data.employment_start_year}
                onValueChange={(value) => handleSelectChange('employment_start_year', value)}>
                <SelectTrigger className="w-full text-black border-gray-400 text-sm">
                  <SelectValue placeholder="Start Year" />
                </SelectTrigger>
                <SelectContent className="max-h-48" >
                  <SelectGroup >
                    {employmentYearOptions.map((year) => (
                      <SelectItem key={year.value} value={year.value} >
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={data.is_current ? 'current' : data.employment_end_year}
                onValueChange={(value) => handleSelectChange('employment_end_year', value)}>
                <SelectTrigger className="w-full text-black border-gray-400 text-sm">
                  <SelectValue placeholder="End Year" />
                </SelectTrigger>
                <SelectContent className="max-h-48" >
                  <SelectGroup >
                    <SelectItem value="current">Present/Current</SelectItem>
                    {employmentYearOptions.map((year) => (
                      <SelectItem key={year.value} value={year.value} >
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              </div>

              <div className="flex flex-col gap-3 py-3">
                {EMPLOYED_FIELDS.map((field) => (
                  <TextInput
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    value={data[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    error={errors[field.name]}
                  />
                ))}
              </div>

            </div>
          )}

          {step === 6 && data.currently_employed === 'No' && (
            <div className='flex flex-col gap-3 p-4'>
            <h2 className="text-md text-center font-semibold text-slate-900">
                What is your reason for not working at the moment?
            </h2>
            <Select
              value={data.unemployment_reason}
              onValueChange={(value) => handleSelectChange('unemployment_reason', value)}
            >
              <SelectTrigger className="w-full text-black border-gray-400 text-sm">
                <SelectValue placeholder="Select your reason" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="Studying">Studying</SelectItem>
                <SelectItem value="Job Hunting">Job Hunting</SelectItem>
                <SelectItem value="Family Reasons">Family Reasons</SelectItem>
                <SelectItem value="Health Reasons">Health Reasons</SelectItem>
                <SelectItem value="Personal Reasons">Personal Reasons</SelectItem>
                <SelectItem value="Career Break">Career Break</SelectItem>
                <SelectItem value="Recently Resigned">Recently Resigned</SelectItem>
                <SelectItem value="Laid Off">Laid Off</SelectItem>
                <SelectItem value="Relocating">Relocating</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.unemployment_reason && (
              <p className="text-xs text-red-600">{errors.unemployment_reason}</p>
            )}
            </div>
          )}

        </form>
      </CardContent>

      <CardFooter className="flex w-full flex-col items-center justify-center gap-1 text-center text-sm sm:text-base">
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="w-1/4"
            >
              Back
            </Button>

            {step < 5 && (
              <Button
                type="button"
                onClick={nextStep}
                disabled={
                  (step === 1 && !isStepOneComplete) ||
                  (step === 2 && !isStepTwoComplete) ||
                  (step === 3 && !isStepThreeComplete) ||
                  (step === 4 && !data.currently_employed)
                }
                className="w-1/4"
              >
                Next
              </Button>
            )}
          </div>

          {(step === 5 || step === 6) && (
            <Button
              form="signupForm"
              variant="blue"
              type="submit"
              size="login2"
              disabled={processing}
              className="h-11 w-full text-sm sm:h-12 sm:text-base md:h-14"
            >
              Sign Up
            </Button>
          )}
        </div>

        <div className="flex w-full flex-row items-center justify-center gap-2 p-3">
          <p>Already have an account?</p>
          <TextLink
            routeName="alumna.login"
            linkName="Login Here"
            className="text-blue-600"
          />
        </div>
      </CardFooter>
    </Card>
  );
}

AlumnaSignup.layout = (page) => <AuthLayout>{page}</AuthLayout>;